import { MapleData } from '../data';
import { MapleDataType } from './data-type';
import { File } from './file';
import { DOMParser } from 'xmldom';
import { MapleDataEntity } from '../data-entity';
import * as xml from 'fast-xml-parser';
import { Point } from '../../util/point';


export class XMLMapleData implements MapleData {

    // node: any; // Type would be nice here
    xml_data: any;
    image_data_dir: File;
    is_root: boolean;
    tag_name: string;

    name: string;
    parent: MapleDataEntity;
    type: MapleDataType;
    children: Array<MapleData>;
    data: any;


    constructor(xml_data: any, image_data_dir: File, parent: XMLMapleData = null, tag_name: string = null) { 
        if (!parent) {
            // Root is guaranteed to be imgdir, only one node
            this.is_root = true;
            this.tag_name = 'imgdir';
            this.xml_data = xml_data[this.tag_name][0];
        } else {
            this.parent = parent;
            this.tag_name = tag_name;
            this.xml_data = xml_data;
        }

        this.image_data_dir = image_data_dir;
        this.name = this.xml_data.attr.name;
        this.init();
    }

    static from_string(xml_string: string, image_data_dir: File, parent: XMLMapleData = null, tag_name: string = null) {
        let xml_data = xml.parse(xml_string, {ignoreAttributes: false, allowBooleanAttributes: true, attrNodeName: 'attr', attributeNamePrefix: '', arrayMode: true});
        return new XMLMapleData(xml_data, image_data_dir, parent, tag_name);
    }

    // TODO: Needs implementation
    get_child_by_path(path: string): MapleData {
        return this;
        // let segments = path.split('/');
        // if (segments[0] === '..') return (this.parent as MapleData).get_child_by_path(path.substring(path.indexOf('/') + 1));

        // let my_node = this.node;
        // for (let s of segments) {
        //     let child_nodes = my_node.childNodes;
        //     let found_child = false;
        //     for (let i = 0; i < child_nodes.length; i++) {
        //         let child_node = child_nodes.item(i);
        //         if (child_node.nodeType === NodeType.ELEMENT_NODE && child_node.attributes.getNamedItem('name').nodeValue === s) {
        //             my_node = child_node;
        //             found_child = true;
        //             break;
        //         }
        //     }
        //     if (!found_child) return null;
        // }
        // // TODO: Validate that this is a valid path
        // let ret = XMLDOMMapleData.from_node(my_node, new File(this.image_data_dir.path + '/' + this.name + '/' + path).get_parent_file());
        // return ret;

    }

    init() {
        this._init_type();
        this._init_data();
        this._init_children();
    }

    private _init_children() {
        this.children = [];
        for (let child_tag_name of Object.keys(this.xml_data)) {
            if (child_tag_name === 'attr') continue; // Skip attribute
            
            for (let child_xml_data of this.xml_data[child_tag_name]) {
                let child = new XMLMapleData(child_xml_data, new File(this.image_data_dir.path + '/' + child_xml_data.attr.name), this, child_tag_name);
                this.children.push(child);
            }
            
        }
    }

    private _init_type() {
        switch (this.tag_name) {
            case 'imgdir':
                this.type = MapleDataType.PROPERTY;
                return;
            case 'canvas':
                this.type = MapleDataType.CANVAS;
                return;
            case 'convex':
                this.type = MapleDataType.CONVEX;
                return;
            case 'sound':
                this.type = MapleDataType.SOUND;
                return;
            case 'uol':
                this.type = MapleDataType.UOL;
                return;
            case 'double':
                this.type = MapleDataType.DOUBLE;
                return;
            case 'float':
                this.type = MapleDataType.FLOAT;
                return;
            case 'int':
                this.type = MapleDataType.INT;
                return;
            case 'short':
                this.type = MapleDataType.SHORT;
                return;
            case 'string':
                this.type = MapleDataType.STRING;
                return;
            case 'vector':
                this.type = MapleDataType.VECTOR;
                return;
            case 'null':
                this.type = MapleDataType.IMG_0x00;
                return;
            default:
                // console.log
                break;
        }
    }

    private _init_data() {
        switch(this.type) {
            case MapleDataType.DOUBLE:
            case MapleDataType.FLOAT:
            case MapleDataType.INT:
            case MapleDataType.SHORT:
                let number = this.xml_data.attr['value'];
                if (this.type === MapleDataType.FLOAT || this.type === MapleDataType.DOUBLE)
                    this.data = Number.parseFloat(number);
                else if (this.type == MapleDataType.INT || this.type === MapleDataType.SHORT)
                    this.data = Number.parseInt(number);
                return;
            case MapleDataType.STRING:
            case MapleDataType.UOL:
                this.data = this.xml_data.attr['value'];
                return;
            case MapleDataType.VECTOR:
                let x = this.xml_data.attr['x'];
                let y = this.xml_data.attr['y'];
                this.data = new Point(Number.parseInt(x), Number.parseInt(y));
                return;
            case MapleDataType.CANVAS:
                let width = this.xml_data.attr['width'];
                let height = this.xml_data.attr['height'];
                // this.data = new FileStoredPNGMapleCanvas(Number.parseInt(width), Number.parseInt(height), new File(this.image_data_dir.path + '/' + this.get_name() + '.png'));
                return;
            default:
                // console.log
                break;
        }
    }


}