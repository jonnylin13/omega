import * as fs from 'fs';

export class File {
    name: string;
    path: string;
    encoding: string = 'utf-8';

    constructor(path: string) {
        this.path = path;
        this.name = path.includes('/') ? path.split('/').slice(-1)[0] : path;
    }

    getParentFile(): File {
        let parent = new File(this.path.split('/').slice(0, -1).join('/'));
        return parent;
    }

    list(): Array<File> {
        let files = fs.readdirSync(this.path);
        return files.map(fileName => {
            if (this.path.charAt(this.path.length - 1) === '/') {
                return new File(this.path + fileName);
            } else return new File(this.path + '/' + fileName);
        });
    }

    isDirectory(): boolean {
        return fs.lstatSync(this.path).isDirectory();
    }
    
    exists(): boolean {
        return fs.existsSync(this.path);
    }

    read(): any {
        return fs.readFileSync(this.path);
    }
}