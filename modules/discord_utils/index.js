const execa = require("execa");
const superagent = require("superagent");
const {
  inputCaptureSetWatcher,
  inputCaptureRegisterElement,
} = require("./input_capture");
const {
  wrapInputEventRegister,
  wrapInputEventUnregister,
} = require("./input_event");

if (process.arch === "arm64") {
  module.exports = {
    /* Dummy replacement functions
    This provides empty functions for
    _keydown
    keyup
    focused
    blurred
    beforeUnload
    inputEventRegister
    inputEventUnregister
    inputWatchAll
    inputSetFocused
    inputGetRegisteredEvents
    setCandidateGamesCallback
    setObservedGamesCallback
    setGameCandidateOverrides
    undetectPid
    notifyGameLaunched
    shouldDisplayNotifications
    setProcessPriority
    getPidFromWindowHandle
    getWindowHandleFromPid
    generateSessionFromPid
    getAudioPid
    setForegroundProcess
    isSystemDarkMode
    _generateLiveMinidump
    nativePermssionRequestAuthorization
    nativePermssionHasAuthorization
    nativePermissionOpenSettings
*/
    _keydown: (...args) => {
      console.log(`_keydown called with ${args.join(", ")}`);
    },
    keyup: (...args) => {
      console.log(`keyup called with ${args.join(", ")}`);
    },
    focused: (...args) => {
      console.log(`focused called with ${args.join(", ")}`);
    },
    blurred: (...args) => {
      console.log(`blurred called with ${args.join(", ")}`);
    },
    beforeUnload: (...args) => {
      console.log(`beforeUnload called with ${args.join(", ")}`);
    },
    inputEventRegister: (eventId, buttons, callback, options) => {
      console.log(
        `inputEventRegister called with ${eventId}, ${buttons}, ${callback}, ${options}`
      );
    },
    inputEventUnregister: (eventId) => {
      console.log(`inputEventUnregister called with ${eventId}`);
    },
    inputWatchAll: (...args) => {
      console.log(`inputWatchAll called with ${args.join(", ")}`);
    },
    inputSetFocused: (...args) => {
      console.log(`inputSetFocused called with ${args.join(", ")}`);
    },
    inputGetRegisteredEvents: (...args) => {
      console.log(`inputGetRegisteredEvents called with ${args.join(", ")}`);
    },
    setCandidateGamesCallback: (...args) => {
      console.log(`setCandidateGamesCallback called with ${args.join(", ")}`);
    },
    setObservedGamesCallback: (...args) => {
      console.log(`setObservedGamesCallback called with ${args.join(", ")}`);
    },
    setGameCandidateOverrides: (...args) => {
      console.log(`setGameCandidateOverrides called with ${args.join(", ")}`);
    },
    setProcessPriority: (...args) => {
      console.log(`setProcessPriority called with ${args.join(", ")}`);
    },
    getPidFromWindowHandle: (...args) => {
      console.log(`getPidFromWindowHandle called with ${args.join(", ")}`);
    },
    getWindowHandleFromPid: (...args) => {
      console.log(`getWindowHandleFromPid called with ${args.join(", ")}`);
    },
    generateSessionFromPid: (...args) => {
      console.log(`generateSessionFromPid called with ${args.join(", ")}`);
    },
    getAudioPid: (...args) => {
      console.log(`getAudioPid called with ${args.join(", ")}`);
    },
    setForegroundProcess: (...args) => {
      console.log(`setForegroundProcess called with ${args.join(", ")}`);
    },
    isSystemDarkMode: (...args) => {
      console.log(`isSystemDarkMode called with ${args.join(", ")}`);
      return true;
    },
    _generateLiveMinidump: (...args) => {
      console.log(`_generateLiveMinidump called with ${args.join(", ")}`);
    },
    nativePermissionRequestAuthorization: (...args) => {
      console.log(
        `nativePermissionRequestAuthorization called with ${args.join(", ")}`
      );
    },
    nativePermissionHasAuthorization: (...args) => {
      console.log(
        `nativePermissionHasAuthorization called with ${args.join(", ")}`
      );
    },
    nativePermissionOpenSettings: (...args) => {
      console.log(
        `nativePermissionOpenSettings called with ${args.join(", ")}`
      );
    },
    shouldDisplayNotifications: (...args) => {
      console.log(`shouldDisplayNotifications called with ${args.join(", ")}`);
      return true;
    },
    // Defined below, not part of native code
    submitLiveCrashReport: async (channel, sentryMetadata) => {
      console.error("CRASH!");
      console.info(JSON.stringify(sentryMetadata));
      console.info(channel);
    },
    clearCandidateGamesCallback: (...args) => {
      console.log(`clearCandidateGamesCallback called with ${args.join(", ")}`);
    },
    inputCaptureRegisterElement: inputCaptureRegisterElement,
    getGPUDriverVersions: async () => {
      return {};
    },
  };
} else {
  module.exports = require("./discord_utils_" + process.platform + ".node");
  module.exports.clearCandidateGamesCallback =
    module.exports.setCandidateGamesCallback;

  inputCaptureSetWatcher(module.exports.inputWatchAll);
  delete module.exports.inputWatchAll;
  module.exports.inputCaptureRegisterElement = inputCaptureRegisterElement;

  module.exports.inputEventRegister = wrapInputEventRegister(
    module.exports.inputEventRegister
  );
  module.exports.inputEventUnregister = wrapInputEventUnregister(
    module.exports.inputEventUnregister
  );

  function parseNvidiaSmiOutput(result) {
    if (!result || !result.stdout) {
      return { error: "nvidia-smi produced no output" };
    }

    const match = result.stdout.match(/Driver Version: (\d+)\.(\d+)/);

    if (match.length === 3) {
      return { major: parseInt(match[1], 10), minor: parseInt(match[2], 10) };
    } else {
      return { error: "failed to parse nvidia-smi output" };
    }
  }

  module.exports.getGPUDriverVersions = async () => {
    if (process.platform !== "win32") {
      return {};
    }

    const result = {};
    const nvidiaSmiPath = `${process.env["ProgramW6432"]}/NVIDIA Corporation/NVSMI/nvidia-smi.exe`;

    try {
      result.nvidia = parseNvidiaSmiOutput(await execa(nvidiaSmiPath, []));
    } catch (e) {
      result.nvidia = { error: e.toString() };
    }

    return result;
  };

  module.exports.submitLiveCrashReport = async (channel, sentryMetadata) => {
    const path = module.exports._generateLiveMinidump();

    if (!path) {
      return null;
    }

    await superagent
      .post(
        "https://sentry.io/api/146342/minidump/?sentry_key=f11e8c3e62cb46b5a006c339b2086ba3"
      )
      .attach("upload_file_minidump", path)
      .field("channel", channel)
      .field("sentry", JSON.stringify(sentryMetadata));
  };
}
