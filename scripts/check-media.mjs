import { closeSync, openSync, readSync, statSync } from 'node:fs'

const videos = ['useme.mp4', 'final3dvideo.mp4']

for (const name of videos) {
  const file = new URL(`../public/video/${name}`, import.meta.url)
  let descriptor

  try {
    const info = statSync(file)
    if (!info.isFile()) throw new Error('path is not a video file')

    descriptor = openSync(file, 'r')
    const header = Buffer.alloc(64)
    readSync(descriptor, header, 0, header.length, 0)

    if (header.subarray(4, 8).toString('ascii') !== 'ftyp') {
      throw new Error('file is not an MP4; check that Git contains the video itself, not a Git LFS pointer')
    }
    if (info.size < 1024) throw new Error('MP4 file is truncated')

    console.log(`Verified public/video/${name} (${(info.size / 1024 / 1024).toFixed(1)} MB)`)
  } catch (error) {
    console.error(`Cannot build: public/video/${name}: ${error.message}`)
    process.exitCode = 1
  } finally {
    if (descriptor !== undefined) closeSync(descriptor)
  }
}
