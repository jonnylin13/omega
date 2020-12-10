import * as fs from 'fs';


export class File {
    name: string;
    path: string;
    encoding: string = 'utf-8'; // Necessary?

    constructor(path: string) {
        this.path = path;
        this.name = path.includes('/') ? path.split('/').slice(-1)[0] : path;
    }

    get_parent_file(): File {
        let parent = new File(this.path.split('/').slice(0, -1).join('/'));
        return parent;
    }

    list_files(): Array<File> {
        let files = fs.readdirSync(this.path);
        return files.map(file_name => new File(this.path + '/' + file_name));
    }

    is_directory(): boolean {
        return fs.lstatSync(this.path).isDirectory();
    }
    
    exists(): boolean {
        return fs.existsSync(this.path);
    }