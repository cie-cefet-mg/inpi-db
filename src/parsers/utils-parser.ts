import { ICTConfig, ICTNamePattern } from "../types/ict-config";
import fs from "fs";

export function getFirstElement(object: any) {
    if (isNonEmptyArray(object) && object[0]) {
        return object[0];
    }

    return undefined;
}

export function isNonEmptyArray(object: any): boolean {
    return !!(object && Array.isArray(object) && object.length > 0);
}

export function isICT(process: any): boolean {
    let match = false;
    const ictConfigPath = "ictconfig.json";
    
    let ictConfig: ICTConfig;
    if(fs.existsSync(ictConfigPath)) {
        ictConfig = JSON.parse(fs.readFileSync(ictConfigPath, "utf-8"));


        ictConfig.namesPatterns.forEach((ictPattern: ICTNamePattern) => {
            if(ictPattern.beginning.length == 0 && ictPattern.ending.length == 0) {
                match = true;
                return;
            }

            const patern = `^(${ictPattern.beginning}){1}[\\w\\s\\W]*(${ictPattern.ending})$`;
            const regex = RegExp(patern, 'i');
            
            process.titulares?.forEach((holder: any) => {
                if(typeof holder === "string") {
                    match = regex.test(holder) ? true : match;
                } else {
                    match = regex.test(holder.nomeCompleto) ? true : match;
                }
                    
            });
        });
    } else {
        match = true;
    }

    return match;
}
