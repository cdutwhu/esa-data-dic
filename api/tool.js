import { promises as fsp } from "fs"
import * as fs from 'fs' // sync listFile
import * as path from 'path'

export const getDir = async (dir) => {
    let names
    try {
        names = await fsp.readdir(dir)
    } catch (e) {
        console.log("error:", e)
        return
    }
    return names
}

// (async () => {
//     const files = await getDir('../')
//     console.log(files)
// })()

export const listFile = async (dir, list = []) => {
    const files = await fsp.readdir(dir, { withFileTypes: true });
    for (const f of files) {
        const fullPath = path.join(dir, f.name);
        if (f.isDirectory()) {
            await listFile(fullPath, list); // ***
        } else {
            list.push(fullPath);
        }
    }
    return list;
}

// (async () => {
//     const files = await listFile('../')
//     console.log(files)
// })()

// export const listFile = (dir, list = []) => {
//     let arr
//     try {
//         arr = fs.readdirSync(dir)
//     } catch (e) {
//         console.log("error:", e)
//         return
//     }
//     arr.forEach((item) => {
//         const fullpath = path.join(dir, item)
//         const stats = fs.statSync(fullpath)
//         if (stats.isDirectory()) {
//             listFile(fullpath, list)
//         } else {
//             list.push(fullpath)
//         }
//     })
//     return list
// }

// (() => {
//     const files = listFile('../')
//     console.log(files)
// })()

export const getFileContent = async (filePath, encoding = "utf-8") => {
    if (!filePath) {
        throw new Error("filePath required")
    }
    return fsp.readFile(filePath, { encoding })
}

// (async () => {
//     const content = await getFileContent("../package.json")
//     console.log(content)
// })()
