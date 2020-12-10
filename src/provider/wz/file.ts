export class File {
    name: string;
    path: string;
    encoding: string = 'utf-8'; // Necessary?

    constructor(path: string) {
        this.path = path;
    }

    // TODO: Needs implementation
    get_parent_file(): File {
        return null;
    }
}