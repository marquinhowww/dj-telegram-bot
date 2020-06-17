const { availableBeats } = require('./availableBeats')

const {
  getFilePath,
  getFileBuffer
} = require('../../lib/path')

const {
  mergeAudios
} = require('../../lib/ffmpeg')

const {
  saveFileLocal,
  getFileInfo,
  sendFile
} = require('../../lib/file')

const resolve = async ({ ctx, bot, info }) => {
  const selectedBeatName = info.actionName

  const { fileId, fileType } = getFileInfo(ctx)
  const filePath = getFilePath(fileId)

  await ctx.editMessageText('saving original')
  await saveFileLocal({ filePath, bot, fileId })

  await ctx.editMessageText('mixing audios')
  const outputMixPath = await mergeAudios({ filePath, fileType, beat: selectedBeatName })

  await ctx.editMessageText('getting result')
  const mixResult = getFileBuffer(outputMixPath)

  const lastMessage = await ctx.editMessageText('sending mix result')
  await sendFile({ fileType, file: mixResult, ctx })

  await ctx.deleteMessage(
    lastMessage.message_id,
    lastMessage.from.id
  )
}

const actions = availableBeats.map(beat => ({
  action: {
    name: beat,
    resolve
  }
}))

module.exports = {
  actions
}
