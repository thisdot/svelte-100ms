import path from 'path'
import fs from 'fs'

function mediapipe_workaround() {
    return {
        name: 'mediapipe_workaround',
        load(id) {
            const MEDIAPIPE_EXPORT_NAMES = {
            'hands.js': [
                'VERSION', 
                'HAND_CONNECTIONS', 
                'Hands', 
            ]
            }
    
            let fileName = path.basename(id);
            if (!(fileName in MEDIAPIPE_EXPORT_NAMES)) return null
            let code = fs.readFileSync(id, 'utf-8');
            for (const name of MEDIAPIPE_EXPORT_NAMES[fileName]) {
            code += `exports.${name} = ${name};`;
            }
            return {code};
        },
    };
}

export default mediapipe_workaround;