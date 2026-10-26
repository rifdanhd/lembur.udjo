import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module, { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const fixtures = JSON.parse(fs.readFileSync(new URL("./fixtures/hero-videos.json", import.meta.url), "utf8"));

// Replace only the database client; exercise the real form, Sharp, and media code.
function service(payload = {}) {
  payload = { find: async () => ({ docs: [] }), ...payload };
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const mod = new Module(filename);
    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(root);
    cache.set(filename, mod);
    mod.require = (specifier) => {
      if (specifier === "@/lib/crm/payload") return { getPayloadClient: async () => payload };
      if (specifier.startsWith("./")) return load(path.resolve(path.dirname(filename), `${specifier}.ts`));
      return require(specifier);
    };
    const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText;
    mod._compile(source, filename);
    return mod.exports;
  }
  return load(path.join(root, "lib/website/images.ts"));
}

function form(mediaType = "image", section = "banner") {
  const data = new FormData();
  for (const [key, value] of Object.entries({ mediaType, section, title: "Hero budaya", alt: "Lanskap Lembur Udjo", position: "0", visible: "true" })) data.set(key, value);
  return data;
}

function video(format = "mp4") {
  return new File([Buffer.from(fixtures[format], "base64")], `hero.${format}`, { type: `video/${format}` });
}

test("accepts real MP4 and WebM; does not transcode video", async () => {
  const { prepareVideo } = service();
  for (const format of ["mp4", "webm"]) {
    const data = form("video");
    data.set("video", video(format));
    const result = await prepareVideo(data);
    assert.equal(result.mimetype, `video/${format}`);
    assert.deepEqual(result.data, Buffer.from(fixtures[format], "base64"));
  }
});

test("rejects spoofed formats, unsupported MIME, and oversized videos", async () => {
  const { prepareVideo } = service();
  for (const file of [
    new File(["<html>not a video</html>"], "spoof.mp4", { type: "video/mp4" }),
    new File([Buffer.from(fixtures.mp4, "base64")], "spoof.webm", { type: "video/webm" }),
    new File(["data"], "clip.mov", { type: "video/quicktime" }),
  ]) {
    const data = form("video");
    data.set("video", file);
    await assert.rejects(prepareVideo(data));
  }
  const data = form("video");
  const large = video();
  Object.defineProperty(large, "size", { value: 30 * 1024 * 1024 + 1 });
  data.set("video", large);
  await assert.rejects(prepareVideo(data), /maksimal 30 MB/);
});

test("video can only be selected for banners; existing image forms remain valid", () => {
  const { parseImageFields } = service();
  assert.throws(() => parseImageFields(form("video", "galeri")), /hanya tersedia/);
  assert.throws(() => parseImageFields(form("invalid")), /Jenis media tidak valid/);
  const legacy = form();
  legacy.delete("mediaType");
  assert.equal(parseImageFields(legacy).mediaType, "image");
});

test("merge preserves image fallback and resolves populated hero videos", () => {
  const { mergeWebsiteImages } = service();
  const docs = [{
    id: 1, placement: "banner-ecoland", section: "banner", alt: "Hero", mimeType: "image/webp",
    heroVideo: { id: 2, filename: "video budaya.mp4", mimeType: "video/mp4" },
  }];
  const banner = mergeWebsiteImages(docs).find((item) => item.key === "banner-ecoland");
  assert.equal(banner.image, "/Hero.ecoland.jpg");
  assert.equal(banner.video, "/api/visual-kawasan/file/video%20budaya.mp4");
  assert.equal(banner.videoMediaId, 2);
  docs[0].heroVideo.mimeType = "text/html";
  assert.equal(mergeWebsiteImages(docs).find((item) => item.key === "banner-ecoland").video, null);
});

test("upload saves video separately and links it without replacing the poster", async () => {
  const calls = [];
  const api = service({ create: async (args) => { calls.push(args); return { id: 42 }; } });
  const data = form("video");
  data.set("video", video());
  await api.saveWebsiteImage(data, "banner-ecoland");
  assert.equal(calls.length, 2);
  assert.equal(calls[0].file.mimetype, "video/mp4");
  assert.equal(calls[0].data.section, undefined);
  assert.equal(calls[1].data.heroVideo, 42);
  assert.equal(calls[1].file, undefined);
});

test("new video banner normalizes its poster to WebP without losing the video link", async () => {
  const calls = [];
  const api = service({ create: async (args) => { calls.push(args); return { id: calls.length }; } });
  const png = await require("sharp")({ create: { width: 32, height: 18, channels: 3, background: "#173522" } }).png().toBuffer();
  const data = form("video");
  data.set("video", video());
  data.set("image", new File([png], "poster.png", { type: "image/png" }));
  await api.saveWebsiteImage(data);
  assert.equal(calls[1].file.mimetype, "image/webp");
  assert.equal(calls[1].data.heroVideo, 1);
  assert.match(calls[1].data.placement, /^custom-/);
});

test("corrupt poster prevents video creation", async () => {
  const api = service({ create: async () => { throw new Error("Must not create"); } });
  const data = form("video");
  data.set("video", video());
  data.set("image", new File(["invalid"], "poster.png", { type: "image/png" }));
  await assert.rejects(api.saveWebsiteImage(data), /Gambar tidak dapat dibaca/);
});

test("text edit keeps an existing video; choosing Image detaches without deleting", async () => {
  const updates = [];
  const api = service({
    find: async () => ({ docs: [{ id: 1, section: "banner", filename: "poster.webp", heroVideo: 2 }] }),
    update: async (args) => { updates.push(args); },
    delete: async () => { throw new Error("Existing media must never be deleted"); },
  });
  await api.saveWebsiteImage(form("video"), "custom-banner");
  await api.saveWebsiteImage(form("image"), "custom-banner");
  assert.equal(updates[0].data.heroVideo, 2);
  assert.equal(updates[1].data.heroVideo, null);
});

test("missing video or poster is rejected before media creation", async () => {
  const api = service({ create: async () => { throw new Error("Must not create"); } });
  await assert.rejects(api.saveWebsiteImage(form("video"), "banner-ecoland"), /Pilih video/);
  const data = form("video");
  data.set("video", video());
  await assert.rejects(api.saveWebsiteImage(data), /Pilih gambar/);
});

test("failed banner save removes only its newly created video", async () => {
  const deleted = [];
  let creates = 0;
  const api = service({
    create: async () => { if (++creates === 1) return { id: 42 }; throw new Error("Parent save failed"); },
    delete: async (args) => { deleted.push(args.id); },
  });
  const data = form("video");
  data.set("video", video());
  await assert.rejects(api.saveWebsiteImage(data, "banner-ecoland"), /Parent save failed/);
  assert.deepEqual(deleted, [42]);
});

test("multipart parser bounds uploads and rejects cross-origin writes", async () => {
  const { readImageForm } = service();
  const body = form("video");
  body.set("video", video());
  const parsed = await readImageForm(new Request("https://lembur.test/api/website-images", { method: "POST", body }));
  assert.equal(parsed.get("video").type, "video/mp4");
  await assert.rejects(readImageForm(new Request("https://lembur.test/api/website-images", {
    method: "POST", headers: { Origin: "https://other.test" }, body: form(),
  })), (error) => error.status === 403);
  await assert.rejects(readImageForm(new Request("https://lembur.test/api/website-images", {
    method: "POST", headers: { "Content-Length": String(39 * 1024 * 1024) }, body: form(),
  })), (error) => error.status === 413);
  let cancelled = false;
  const stream = new ReadableStream({
    start(controller) { controller.enqueue(new Uint8Array(39 * 1024 * 1024)); },
    cancel() { cancelled = true; },
  });
  await assert.rejects(readImageForm(new Request("https://lembur.test/api/website-images", {
    method: "POST", body: stream, duplex: "half",
  })), (error) => error.status === 413);
  assert.equal(cancelled, true);
});

test("homepage reads all pages and requests populated video relations", async () => {
  const calls = [];
  const api = service({ find: async (args) => {
    calls.push(args);
    return {
      docs: [{ id: args.page, placement: `custom-${args.page}`, section: "banner", alt: "Hero", filename: "poster.webp", heroVideo: { id: 3, filename: "clip.mp4", mimeType: "video/mp4" } }],
      hasNextPage: args.page < 2,
    };
  } });
  const items = await api.getWebsiteImages();
  assert.deepEqual(calls.map((args) => [args.page, args.depth]), [[1, 1], [2, 1]]);
  assert.equal(items.filter((item) => item.video).length, 2);
});

test("missing media migration reports setup failure without exposing SQL", async (context) => {
  context.mock.method(console, "error", () => {});
  const { imageErrorResponse } = service();
  const error = new Error("Failed query with internal details");
  error.cause = { code: "42703", message: 'column "hero_video_id" does not exist' };
  const response = imageErrorResponse(error);
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.code, "MEDIA_SCHEMA_NOT_READY");
  assert.doesNotMatch(body.error, /hero_video_id|Failed query/);
  const unexpected = imageErrorResponse(new Error("Unexpected internal failure"));
  assert.equal(unexpected.status, 500);
});
