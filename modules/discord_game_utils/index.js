// On arm64, provide dummy functiona
/*
Provide dummys for
beforeUnload
identifyGame
findLaunchable
isProtocolSchemeRegistered
createShortcuts
removeShortcuts
setRecentGames
*/
if(process.arch === "arm64") {
    module.exports = {
        beforeUnload: (...args) => {console.log(`beforeUnload called with ${args.join(", ")}`);},
        identifyGame: (...args) => {console.log(`identifyGame called with ${args.join(", ")}`);},
        findLaunchable: (...args) => {console.log(`findLaunchable called with ${args.join(", ")}`);},
        isProtocolSchemeRegistered: (...args) => {console.log(`isProtocolSchemeRegistered called with ${args.join(", ")}`);},
        createShortcuts: (...args) => {console.log(`createShortcuts called with ${args.join(", ")}`);},
        removeShortcuts: (...args) => {console.log(`removeShortcuts called with ${args.join(", ")}`);},
        setRecentGames: (...args) => {console.log(`setRecentGames called with ${args.join(", ")}`);},
    };
} else {
    module.exports = require('./discord_game_utils_'+process.platform+'.node');
}
