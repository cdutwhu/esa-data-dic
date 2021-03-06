import { promises as fsp } from "fs"
import * as fs from 'fs' // sync listFile
import * as path from 'path'
import * as util from 'util'

const provided = (param) => {
    return param !== undefined
}

export const assign = (obj, fld, val, dflt_val, fn_css_class, css_class) => {
    if (provided(val)) {
        if (provided(fn_css_class)) {
            obj[fld] = fn_css_class(val, css_class)
        } else {
            obj[fld] = val
        }
    } else {
        obj[fld] = dflt_val
    }
}

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

export const xpath2object = async (xpath, value) => {
    const paths = xpath.split('.')
    let objVal = value
    let object = {}
    for (const seg of paths.reverse()) {
        object = {}
        object[seg] = objVal
        objVal = object
    }
    return object
}

// (async () => {
//     const object = await xpath2object("a.b.c.d.e", true)
//     console.log(object)
//     console.log(util.inspect(object, { showHidden: false, depth: null, colors: true }))
// })()

/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export const isObject = (item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = async (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                await mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

// (async () => {
//     let merged = await mergeDeep({ a: 1 }, { b: { c: { d: { e: 12345 } } } });
//     console.log(merged)

//     const object1 = await xpath2object("a.b.c.d.e", true)
//     console.log(object1)

//     const object2 = await xpath2object("a.b.C.D.E", true)
//     console.log(object2)

//     merged = {}
//     merged = await mergeDeep(merged, object1, object2)
//     console.log(util.inspect(merged, { showHidden: false, depth: null, colors: true }))
// })()

/////////////////////////////////////////////////////////////

export const css_p_id_inject = (p, id) => {
    return p.replaceAll('<p>', `<p id=${id}>`)
}

export const css_p_class_inject = (p, className) => {
    return p.replaceAll('<p>', `<p class=${className}>`)
}