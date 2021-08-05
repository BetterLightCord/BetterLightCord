const updater = require('./updater');
const nativeUpdater = require('./updater.node');
const path = require('path');
const process = require('process');
// TODO(eiz): set things up so we can use desktop core constants properly.
const {ipcRenderer} = require('electron');

const ALLOWED_CHANNELS = ['stable', 'ptb', 'canary', 'development'];
const ALLOWED_PLATFORMS = ['win'];

let bootstrapUpdater;

async function bootstrap(releaseChannel, platform) {
  if (!ALLOWED_CHANNELS.includes(releaseChannel) || !ALLOWED_PLATFORMS.includes(platform)) {
    throw new Error('You tried.');
  }

  bootstrapUpdater = new updater.Updater({
    nativeUpdaterModule: nativeUpdater,
    release_channel: releaseChannel,
    platform: platform,
    // Sorry _app, you can't pass this in =)
    repository_url: 'https://discord.com/api/updates/',
    root_path: path.join(path.dirname(process.execPath), '..'),
  });
  let downloadedAnything = false;

  bootstrapUpdater.on('host-updated', () => {
    try {
      ipcRenderer.send('DISCORD_UPDATE_OPEN_ON_STARTUP');
    } catch (e) {
      console.log('Failed to update autostart registration after bootstrap:', e);
    }
  });

  await bootstrapUpdater.updateToLatest((progress) => {
    const task = progress.task;
    const downloadTask = task.HostDownload || task.ModuleDownload;

    if (downloadTask != null) {
      downloadedAnything = true;
    }
  });
}

async function finishBootstrap() {
  const versions = await bootstrapUpdater.queryCurrentVersions();

  ipcRenderer.send('DISCORD_NATIVE_MODULES_FINISH_UPDATER_BOOTSTRAP', versions.current_host);
}

module.exports.bootstrap = bootstrap;
module.exports.finishBootstrap = finishBootstrap;
