export class File {
    name: string;
    path: string;
    encoding: string = 'utf-8'; // Necessary?

    constructor(path: string) {
        this.path = path;
    }

    // TODO: Needs validation
    get_parent_file(): File {
        return new File(this.path.split('/').slice(0, -1).join('/'));
    }
}