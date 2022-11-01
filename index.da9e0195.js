var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function(resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Vertex;
(function(Vertex) {
    class Guid {
        static NewGuid() {
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 0x3 | 0x8;
                return v.toString(16);
            });
        }
    }
    Vertex.Guid = Guid;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class Component {
            constructor(){
                this.doNotSerialize = false;
                this.events = new Map();
                this.isUpdatingState = false;
                this.onChanged = new Vertex.EventBus();
                this.onAdded = new Vertex.EventBus();
                this.onRemoved = new Vertex.EventBus();
                this.onChanged = new Vertex.EventBus();
                this.onAdded = new Vertex.EventBus();
                this.onRemoved = new Vertex.EventBus();
            }
            get Dirty() {
                return this.dirty;
            }
            markDirty() {
                this.dirty = true;
            }
            clearDirty() {
                this.dirty = false;
            }
            triggerOnChanged() {
                if (!this.isUpdatingState) {
                    this.markDirty();
                    this.onChanged.trigger(this);
                }
            }
            getNode() {
                return this.node;
            }
            writeData(writer, delta) {}
            readData(reader) {}
            writeDataBSON(writer) {
                let ctx = writer.startObject();
                writer.endObject(ctx);
            }
            readDataBSON(reader) {
                reader.readObject((a, b, c)=>{});
            }
        }
        NodeComponentModel.Component = Component;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
/// <reference path="ComponentModel/component.ts"/>
var Vertex;
(function(Vertex) {
    class EventHub {
        constructor(){
            this.events = new Map();
        }
        on(name, handler) {
            var event = this.events.get(name);
            if (!event) {
                event = new EventBus();
                this.events.set(name, event);
            }
            event.on(handler);
        }
        off(name, handler) {
            var event = this.events.get(name);
            if (!event) return;
            event.off(handler);
        }
        fire(name, data) {
            return __awaiter(this, void 0, void 0, function*() {
                var event = this.events.get(name);
                if (!event) return;
                yield event.trigger(data);
            });
        }
        reset(name) {
            var event = this.events.get(name);
            if (!event) return;
            event.reset();
        }
    }
    Vertex.EventHub = EventHub;
    class EventBus {
        constructor(){
            this.handlers = [];
        }
        on(handler) {
            this.handlers.push(handler);
        }
        off(handler) {
            this.handlers = this.handlers.filter((h)=>h !== handler);
        }
        trigger(data) {
            return __awaiter(this, void 0, void 0, function*() {
                //this.handlers.slice(0).forEach(h => h(data));
                let handlerCopy = this.handlers.slice(0);
                for (let handler of handlerCopy)yield handler(data);
            });
        }
        reset() {
            this.handlers = [];
        }
        expose() {
            return this; //hmm
        }
    }
    Vertex.EventBus = EventBus;
    class MonitoredEvent {
        constructor(target){
            this.handlers = [];
            this.target = target;
        }
        on(handler) {
            this.handlers.push(handler);
        }
        off(handler) {
            this.handlers = this.handlers.filter((h)=>h !== handler);
        }
        trigger(data) {
            return __awaiter(this, void 0, void 0, function*() {
                //this.handlers.slice(0).forEach(h => h(data));
                let handlerCopy = this.handlers.slice(0);
                for (let handler of handlerCopy)yield handler(data);
            });
        }
        reset() {
            this.handlers = [];
        }
        expose() {
            return this;
        }
    }
    Vertex.MonitoredEvent = MonitoredEvent;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    class DebugReporter {
        constructor(){
            this.displayDebugContext = false;
            this.displayDebugState = false;
            this.debugState = "";
            this.debugContext = null;
        }
        setDebugState(state, context) {
            this.debugState = state;
            this.debugContext = context;
            if (this.displayDebugState === true) console.debug("[VERTX:BinaryWriter]: " + this.debugState, this.displayDebugContext ? this.debugContext : null);
        }
    }
    Vertex.DebugReporter = DebugReporter;
    class BinaryWriter extends DebugReporter {
        constructor(maxSize){
            super();
            this.littleEndian = true;
            this.buffer = new Uint8Array(maxSize);
            this.writer = new DataView(this.buffer.buffer);
            this.index = 0;
        }
        get Index() {
            return this.index;
        }
        set Index(value) {
            this.index = value;
        }
        clear() {
            this.buffer.fill(0x0, 0, this.buffer.length);
        }
        asBufferView() {
            return this.buffer.subarray(0, this.index);
        }
        toBuffer() {
            return this.buffer.buffer.slice(0, this.index);
        }
        dispose() {}
        writeSingle(value) {
            this.writer.setFloat32(this.index, value, this.littleEndian);
            this.index += 4;
        }
        writeDouble(value) {
            this.writer.setFloat64(this.index, value, this.littleEndian);
            this.index += 8;
        }
        writeInt16(value) {
            this.writer.setInt16(this.index, value, this.littleEndian);
            this.index += 2;
        }
        writeInt32(value) {
            this.writer.setInt32(this.index, value, this.littleEndian);
            this.index += 4;
        }
        writeUInt16(value) {
            this.writer.setUint16(this.index, value, this.littleEndian);
            this.index += 2;
        }
        writeUInt32(value) {
            this.writer.setUint32(this.index, value, this.littleEndian);
            this.index += 4;
        }
        writeBool(value) {
            if (value === true) this.buffer.set([
                1
            ], this.index);
            else this.buffer.set([
                0
            ], this.index);
            this.index += 1;
        }
        writeByte(value) {
            this.buffer[this.index] = value;
            this.index += 1;
        }
        writeString(value) {
            if (typeof value !== "string") {
                console.error("The value of " + value + " must be a string");
                return;
            }
            if (value === null) {
                console.error("The string: " + value + " cannot be null");
                return;
            }
            if (value.length === 0) {
                this.write7BitEncodedInt(0);
                return;
            }
            var stringValue = value;
            //The string is written to the buffer using UTF8 magic.
            var uriEncoded = Vertex.UTF8.Encode(value);
            //We prefex the string with a uInt of it's length.
            this.write7BitEncodedInt(uriEncoded.length);
            this.buffer.set(uriEncoded, this.index);
            this.index += uriEncoded.length;
        }
        writeBytes(buffer, length) {
            this.buffer.set(buffer, this.index);
            this.index += length;
        }
        //-_-
        //[todo] Test and evaluate this, this is an encoding bug hotspot!
        write7BitEncodedInt(value) {
            if (value > 256) console.warn("Encoding huge string!! is this intentional?");
            var v = value >>> 0; //cut the sign bit off the number
            while(v >= 0x80){
                this.buffer[this.index] = v | 0x80;
                this.index += 1;
                v = v >> 7 >>> 0;
            }
            this.buffer[this.index] = v;
            this.index += 1;
        }
        writeArray(buffer) {
            var charBuffer = new Uint8Array(buffer);
            for(var i = 0; i < charBuffer.byteLength; i++){
                this.buffer[this.index] = charBuffer[i];
                this.index++;
            }
        }
    }
    Vertex.BinaryWriter = BinaryWriter;
})(Vertex || (Vertex = {}));
/// <reference path="binarywriter.ts"/>
var Vertex;
(function(Vertex) {
    class BinaryReader extends Vertex.DebugReporter {
        constructor(buffer){
            super();
            this.littleEndian = true;
            this.buffer = new Uint8Array(buffer);
            this.reader = new DataView(this.buffer.buffer);
            this.index = 0;
        }
        get Index() {
            return this.index;
        }
        set Index(value) {
            this.index = value;
        }
        readSingle() {
            this.index += 4;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getFloat32(this.index - 4, this.littleEndian);
        }
        readDouble() {
            this.index += 8;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getFloat64(this.index - 8, this.littleEndian);
        }
        readInt16() {
            this.index += 2;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getInt16(this.index - 2, this.littleEndian);
        }
        readInt32() {
            this.index += 4;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getInt32(this.index - 4, this.littleEndian);
        }
        readUInt16() {
            this.index += 2;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getUint16(this.index - 2, this.littleEndian);
        }
        readUInt32() {
            this.index += 4;
            if (this.index > this.buffer.byteLength) {
                new Error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
                console.error("Length error with reader, index " + this.index + " is greater than the buffer length " + this.buffer.byteLength);
            }
            return this.reader.getUint32(this.index - 4, this.littleEndian);
        }
        readBool() {
            var value = this.buffer[this.index];
            this.index += 1;
            if (value === 0) return false;
            else return true;
        }
        readByte() {
            this.index += 1;
            return this.buffer[this.index - 1];
        }
        readBytes(count) {
            let bytes = this.buffer.slice(this.index, this.index + count);
            this.index += count;
            return bytes;
        }
        peekByte() {
            return this.buffer[this.index + 1];
        }
        readString() {
            var length = this.read7BitEncodedInt();
            if (length === 0) return "";
            var string = Vertex.UTF8.Decode(this.buffer.slice(this.index, this.index + length));
            this.index += length;
            return string;
        }
        read7BitEncodedInt() {
            let length = 0, shift = 0, offset = 0;
            let byte;
            do {
                byte = this.buffer[this.index + offset++];
                length |= (byte & 0x7F) << shift;
                shift += 7;
            }while (byte >= 0x80);
            this.index += offset;
            return length;
        }
        readArray() {
            return null;
        }
        skipAhead(numBytes) {
            this.index += numBytes;
        }
    }
    Vertex.BinaryReader = BinaryReader;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        let Layer;
        (function(Layer) {
            Layer[Layer["Layer1"] = 2] = "Layer1";
            Layer[Layer["Layer2"] = 4] = "Layer2";
            Layer[Layer["Layer3"] = 8] = "Layer3";
            Layer[Layer["Layer4"] = 16] = "Layer4";
            Layer[Layer["Layer5"] = 32] = "Layer5";
            Layer[Layer["Layer6"] = 64] = "Layer6";
            Layer[Layer["Layer7"] = 128] = "Layer7";
            Layer[Layer["Layer8"] = 256] = "Layer8";
            Layer[Layer["Layer9"] = 512] = "Layer9";
            Layer[Layer["Layer10"] = 1024] = "Layer10";
            Layer[Layer["Layer11"] = 2048] = "Layer11";
            Layer[Layer["Layer12"] = 4096] = "Layer12";
            Layer[Layer["Layer13"] = 8192] = "Layer13";
            Layer[Layer["Layer14"] = 16384] = "Layer14";
            Layer[Layer["Layer15"] = 32768] = "Layer15";
            Layer[Layer["Layer16"] = 65536] = "Layer16";
            Layer[Layer["Layer17"] = 131072] = "Layer17";
            Layer[Layer["Layer18"] = 262144] = "Layer18";
            Layer[Layer["Layer19"] = 524288] = "Layer19";
            Layer[Layer["Layer20"] = 1048576] = "Layer20";
            Layer[Layer["Layer21"] = 2097152] = "Layer21";
            Layer[Layer["Layer22"] = 4194304] = "Layer22";
            Layer[Layer["Layer23"] = 8388608] = "Layer23";
            Layer[Layer["Layer24"] = 16777216] = "Layer24";
            Layer[Layer["Layer25"] = 33554432] = "Layer25";
            Layer[Layer["Layer26"] = 67108864] = "Layer26";
            Layer[Layer["Layer27"] = 134217728] = "Layer27";
            Layer[Layer["Layer28"] = 268435456] = "Layer28";
            Layer[Layer["Layer29"] = 536870912] = "Layer29";
            Layer[Layer["Layer30"] = 1073741824] = "Layer30";
            Layer[Layer["Layer31"] = -2147483648] = "Layer31";
            Layer[Layer["Layer32"] = 1] = "Layer32";
            Layer[Layer["AllLayers"] = 4294967295] = "AllLayers";
        })(Layer = NodeComponentModel.Layer || (NodeComponentModel.Layer = {}));
        let ComponentDataType;
        (function(ComponentDataType) {
            ComponentDataType[ComponentDataType["Binary"] = 0] = "Binary";
            ComponentDataType[ComponentDataType["BSON"] = 1] = "BSON";
            ComponentDataType[ComponentDataType["Json"] = 2] = "Json";
            ComponentDataType[ComponentDataType["BSONObject"] = 3] = "BSONObject";
        })(ComponentDataType = NodeComponentModel.ComponentDataType || (NodeComponentModel.ComponentDataType = {}));
        var ComponentDataTypeStrings = [
            "Binary",
            "BSON",
            "Json",
            "BSONObject"
        ];
        // Determines what happens to the node when it's token is handed off
        let TokenHandoffPolicy;
        (function(TokenHandoffPolicy) {
            // Destroy the node when the client hands off the token, usually when they leave a space
            TokenHandoffPolicy[TokenHandoffPolicy["Destroy"] = 0] = "Destroy";
            // Keeps nodes persisted in the space but doesn't persist them when the last client leaves the space
            TokenHandoffPolicy[TokenHandoffPolicy["DestroyWithLastClient"] = 1] = "DestroyWithLastClient";
            // Orphan this node and persist it in the space for other users to adopt
            TokenHandoffPolicy[TokenHandoffPolicy["Persist"] = 2] = "Persist";
            // This node is destroyed from the space, but is persisted in the users personal store, it roams with them into the next space they join
            TokenHandoffPolicy[TokenHandoffPolicy["Portable"] = 3] = "Portable";
        })(TokenHandoffPolicy = NodeComponentModel.TokenHandoffPolicy || (NodeComponentModel.TokenHandoffPolicy = {}));
        var TokenHandoffPolicyStrings = [
            "Destroy",
            "DestroyWithLastClient",
            "Persist",
            "Portable"
        ];
        function EnumAsString(value) {
            return TokenHandoffPolicyStrings[value];
        }
        NodeComponentModel.EnumAsString = EnumAsString;
        /**
         * this is a flags enum
         * */ let LodPolicy;
        (function(LodPolicy) {
            LodPolicy[LodPolicy["None"] = 0] = "None";
            LodPolicy[LodPolicy["Distance"] = 1] = "Distance";
            LodPolicy[LodPolicy["Frequency"] = 2] = "Frequency";
            LodPolicy[LodPolicy["DistanceAndFrequency"] = 3] = "DistanceAndFrequency";
        })(LodPolicy = NodeComponentModel.LodPolicy || (NodeComponentModel.LodPolicy = {}));
        //export class ViewNode extends BABYLON.Mesh {
        //    constructor(name: string, scene: BABYLON.Scene) {
        //        super(name, scene);
        //    }
        //    onNodeChangedObservable: BABYLON.Observable<BABYLON.Mesh> = new BABYLON.Observable<BABYLON.Mesh>();
        //}
        class VertexNode {
            constructor(componentSystem, space){
                this.isDirty = false;
                this.name = "default";
                this.tokenHandoffPolicy = TokenHandoffPolicy.Destroy;
                this.tags = [];
                this.layer = Layer.Layer32;
                this.componentDataType = ComponentDataType.Binary;
                this.components = [];
                this.lodPolicy = LodPolicy.None;
                this.lodDistance = 0.0;
                this.doNotSerialize = false;
                this.onDestroy = new Vertex.EventBus();
                this.event = new Vertex.EventHub();
                this.space = null;
                this.space = space;
                this.id = Vertex.Guid.NewGuid();
                this.parent = "00000000-0000-0000-0000-000000000000", this.spaceId = "00000000-0000-0000-0000-000000000000", this.componentSystem = componentSystem;
                this.hasToken = false;
            }
            get HasToken() {
                return this.hasToken;
            }
            get HasChanges() {
                if (this.isDirty) return true;
                for (var id of this.components){
                    var component = this.componentSystem.getComponent(id, this);
                    if (component && component.Dirty) return true;
                }
                return false;
            }
            set HasChanges(value) {
                //if (value && !this.isDirty)
                //    this.isDirty = value;
                for (var id of this.components){
                    var component = this.componentSystem.getComponent(id, this);
                    if (!component) continue;
                    if (value) component.markDirty();
                    else component.clearDirty();
                }
                this.isDirty = value;
            }
            get Space() {
                return this.space;
            }
            createComponent(name) {
                if (!this.componentSystem) {
                    console.error("Entity " + this.id + " does not have a valid ComponentSystem reference");
                    return;
                }
                var component = this.componentSystem.createComponent(name);
                return component;
            }
            addComponent(name, instance = null) {
                if (!this.componentSystem) {
                    console.error("Entity " + this.id + " does not have a valid ComponentSystem reference");
                    return;
                }
                if (this.components.findIndex((v, i, o)=>{
                    return v === name;
                }) === -1) this.components.push(name);
                var component = this.componentSystem.getComponent(name, this);
                if (component === null) component = this.componentSystem.addComponent(name, this, instance);
                component.markDirty();
                return component;
            }
            getComponent(name) {
                return this.componentSystem.getComponent(name, this);
            }
            removeComponent(name) {
                this.componentSystem.removeComponent(name, this);
                this.HasChanges = true;
                let i = this.components.indexOf(name);
                if (i > -1) this.components.splice(i, 1);
                if (this.hasToken) this.isDirty = true;
            }
            acquireToken(policy = TokenHandoffPolicy.Destroy, callback) {
                this.hasToken = true;
                var self = this;
                this.space.acquireToken(this, policy, (result)=>{
                    //console.log("Token result for: " + self.id)
                    //console.log(result);
                    callback(result.result);
                });
            }
            releaseToken(policy = TokenHandoffPolicy.Destroy) {
                this.space.releaseToken(this, policy);
            }
            writeData(writer, delta) {
                writer.setDebugState("[VERTX:BinaryWriter:Node:" + this.id + "]", this);
                writer.setDebugState("[VERTX:BinaryWriter:Node:Properties]", this);
                writer.writeString(this.id);
                writer.writeString(this.parent);
                writer.writeString(this.spaceId);
                writer.writeString(this.name);
                writer.writeUInt32(this.layer);
                writer.writeUInt32(this.tokenHandoffPolicy);
                writer.writeUInt32(this.componentDataType);
                //An extra 8 bytes for future use
                writer.writeInt32(0);
                writer.setDebugState("[VERTX:BinaryWriter:Node:Tags]", this);
                writer.writeInt32(this.tags.length);
                if (this.tags.length > 0) for (var tag of this.tags)writer.writeString(tag);
                writer.setDebugState("[VERTX:BinaryWriter:Node:Components]", this);
                var names = [];
                var componentWriter = new Vertex.BinaryWriter(2048);
                var bsonWriter = null;
                if (this.componentDataType === ComponentDataType.BSON) bsonWriter = new Vertex.BSONWriter(componentWriter);
                componentWriter.displayDebugState = false;
                for (var id of this.components){
                    var component = this.componentSystem.getComponent(id, this);
                    if (!component) {
                        console.error("Node Serialization Error. Context: ", {
                            node: this,
                            componentId: id,
                            fetchedComponent: component
                        });
                        throw new Error(`Critical Node Serialization Error:'getComponent' returned null for component '${id}'.\nMaybe this component isn't registered?`);
                    }
                    var write = (function() {
                        names.push(id);
                        componentWriter.writeUInt16(0);
                        let startIdx = componentWriter.Index;
                        if (this.componentDataType === ComponentDataType.BSON) component.writeDataBSON(bsonWriter);
                        else component.writeData(componentWriter, delta);
                        let endIdx = componentWriter.Index;
                        let size = endIdx - startIdx;
                        //console.log("Component Data Size: " + size);
                        componentWriter.Index = startIdx - 2;
                        componentWriter.writeUInt16(size);
                        componentWriter.Index = endIdx;
                    }).bind(this);
                    if (component.doNotSerialize === false) {
                        if (delta) {
                            if (component.Dirty) write();
                        } else write();
                    }
                }
                writer.writeInt32(names.length);
                for (var name of names)writer.writeString(name);
                var componentBuffer = componentWriter.toBuffer();
                writer.setDebugState("[VERTX:BinaryWriter:Node:ComponentData: " + componentBuffer.byteLength + "bytes]", this);
                writer.writeInt32(componentBuffer.byteLength);
                writer.writeArray(componentBuffer);
                this.isDirty = false;
            }
            readData(reader) {
                reader.setDebugState("[VERTX:BinaryWriter:Node:Properties]", this);
                try {
                    this.id = reader.readString();
                    this.parent = reader.readString();
                    this.spaceId = reader.readString();
                    this.name = reader.readString();
                    this.layer = reader.readUInt32();
                    this.tokenHandoffPolicy = reader.readUInt32();
                    this.componentDataType = reader.readInt32();
                    //Padding for future use
                    reader.readInt32();
                } catch (e) {
                    console.error(e);
                }
                reader.setDebugState("[VERTX:BinaryWriter:Node:Tags]", this);
                var tagLength = reader.readInt32();
                if (tagLength > 0) {
                    this.tags = [];
                    for(var i = 0; i < tagLength; i++)this.tags[i] = reader.readString();
                }
                reader.setDebugState("[VERTX:BinaryWriter:Node:Components]", this);
                var componentLength = reader.readInt32();
                if (componentLength > 0) {
                    let oldComponents = this.components.slice(0);
                    this.components = [];
                    for(var i = 0; i < componentLength; i++)this.components[i] = reader.readString();
                    for (let removedComponent of oldComponents)if (this.components.indexOf(removedComponent) === -1) this.removeComponent(removedComponent);
                }
                reader.setDebugState("[VERTX:BinaryWriter:Node:ComponentData]", this);
                this.updateComponentData(reader);
                this.isDirty = false;
            }
            updateComponentData(reader) {
                var bsonReader = null;
                if (this.componentDataType === ComponentDataType.BSON) bsonReader = new Vertex.BSONReader(reader);
                var componentDataLength = reader.readInt32();
                reader.displayDebugState = false;
                for (var id of this.components.values()){
                    var componentLength = reader.readUInt16();
                    var startIndex = reader.Index;
                    if (this.componentSystem.hasComponentSystem(id)) {
                        reader.setDebugState("[VERTX:BinaryWriter:Node:ComponentData:" + id + "]", component);
                        var component = this.getComponent(id);
                        let newComponent = false;
                        if (component === null) {
                            newComponent = true;
                            component = this.createComponent(id);
                        }
                        try {
                            if (componentLength > 0) {
                                if (this.componentDataType === ComponentDataType.BSON) component.readDataBSON(bsonReader);
                                else component.readData(reader);
                            }
                        } catch (e) {
                            console.error(`[VERTX:Node] An unhandled error occured when deserializing a '${id}' Component.`, {
                                node: this,
                                componentName: id,
                                component: component,
                                componentLength: componentLength,
                                componentDataType: this.componentDataType
                            });
                        }
                        if (newComponent) this.addComponent(id, component);
                        component.triggerOnChanged();
                        component.clearDirty();
                        if (reader.Index !== startIndex + componentLength) {
                            let dataType = this.componentDataType === ComponentDataType.BSON ? "BSON" : "Binary";
                            console.error(`Deserialization [${dataType}] error for ${id}.\n` + `StartIndex: ${startIndex}, Expected Index: ${startIndex + componentLength} (${componentLength} bytes), Actual Index: ${reader.Index}`, component);
                            reader.Index = startIndex + componentLength;
                        }
                    } else reader.skipAhead(componentLength);
                }
            }
            writeDataBSON(writer) {
                if (this.componentDataType !== ComponentDataType.BSONObject) {
                    console.error("Attempted to encode a component to BSON when it is in legacy mode!", this);
                    return;
                }
                let ctx = writer.startObject();
                writer.writeString("Id", this.id);
                writer.writeString("Parent", this.parent);
                writer.writeString("SpaceId", this.spaceId);
                writer.writeString("TokenHandoffPolicy", TokenHandoffPolicyStrings[this.tokenHandoffPolicy]);
                writer.writeString("Name", this.name);
                writer.writeArray("Tags", this.tags, writer.writeString);
                writer.writeInt32("Layer", this.layer);
                writer.writeString("ComponentDataType", ComponentDataTypeStrings[this.componentDataType]);
                writer.writeArray("Components", this.components, writer.writeString);
                writer.writeObject("Data", this.writeComponentDataBSON.bind(this));
                writer.writeInt32("LodPolicy", this.lodPolicy);
                writer.writeDouble("LodDistance", this.lodDistance);
                writer.endObject(ctx);
            }
            writeComponentDataBSON(writer) {
                let ctx = writer.startObject();
                for (let componentName of this.components){
                    let component = this.getComponent(componentName);
                    if (component) writer.writeObject(componentName, component.writeDataBSON.bind(component));
                }
                writer.endObject(ctx);
            }
            bsonReadAction(name, type, reader) {
                if (name === "Id" && type === Vertex.BsonType.String) reader.readString(this, "id");
                if (name === "Parent" && type === Vertex.BsonType.String) reader.readString(this, "parent");
                if (name === "SpaceId" && type === Vertex.BsonType.String) reader.readString(this, "spaceId");
                if (name === "TokenHandoffPolicy" && type === Vertex.BsonType.String) reader.readEnum(this, "tokenHandoffPolicy", TokenHandoffPolicyStrings);
                if (name === "Name" && type === Vertex.BsonType.String) reader.readString(this, "name");
                if (name === "Tags" && type === Vertex.BsonType.Array) reader.readArray(this, "tags", reader.readString);
                if (name === "Layer" && type === Vertex.BsonType.Int32) reader.readInt32(this, "layer");
                if (name === "ComponentDataType" && type === Vertex.BsonType.String) reader.readEnum(this, "componentDataType", ComponentDataTypeStrings);
                if (name === "Components" && type === Vertex.BsonType.Array) {
                    let oldComponents = this.components.slice(0);
                    reader.readArray(this, "components", reader.readString);
                    for (let removedComponent of oldComponents)if (this.components.indexOf(removedComponent) === -1) this.removeComponent(removedComponent);
                }
                if (name === "Data" && type === Vertex.BsonType.Object) reader.readObject(this.readComponentDataBson.bind(this));
                if (name === "LodPolicy" && type === Vertex.BsonType.Int32) reader.readInt32(this, "lodPolicy");
                if (name === "LodDistance" && type === Vertex.BsonType.Double) reader.readDouble(this, "lodDistance");
            }
            readComponentDataBson(name, type, reader) {
                if (this.componentSystem.hasComponentSystem(name)) {
                    var component = this.getComponent(name);
                    let newComponent = false;
                    if (component === null) {
                        newComponent = true;
                        component = this.createComponent(name);
                    }
                    try {
                        component.readDataBSON(reader);
                    } catch (e) {
                        console.error(`[VERTX:Node] An unhandled error occured when deserializing a '${name}' Component.`, {
                            node: this,
                            componentName: name,
                            component: component,
                            componentDataType: this.componentDataType
                        });
                    }
                    if (newComponent) this.addComponent(name, component);
                    component.triggerOnChanged();
                    component.clearDirty();
                } else reader.readObjectBlind();
            }
            readDataBSON(reader) {
                if (this.componentDataType !== ComponentDataType.BSONObject) {
                    console.error("Attempted to decode a component from BSON when it is in mode:", this.componentDataType, this);
                    return;
                }
                reader.readObject(this.bsonReadAction.bind(this));
            }
        }
        NodeComponentModel.VertexNode = VertexNode;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let Net;
    (function(Net) {
        class ClientStats {
            constructor(){
                this.sentMessageCount = 0;
                this.rcvMessageCount = 0;
                this.bytesSent = 0;
                this.bytesRecieved = 0;
            }
        }
        Net.ClientStats = ClientStats;
        class Client {
            constructor(uri, spaceId){
                this.isConnected = false;
                this.openEvent = new Vertex.EventBus();
                this.closeEvent = new Vertex.EventBus();
                this.errorEvent = new Vertex.EventBus();
                this.dataEvent = new Vertex.EventBus();
                this.spaceId = spaceId;
                this.uri = uri;
                this.viewpointId = Vertex.Guid.NewGuid();
                console.log(`[VERTX:Client] Uri: ${this.uri}, SpaceId: ${this.spaceId}, ViewpointID: ${this.viewpointId}`);
            }
            get ViewpointId() {
                return this.viewpointId;
            }
            connect() {
                return __awaiter(this, void 0, void 0, function*() {});
            }
            disconnect() {
                return __awaiter(this, void 0, void 0, function*() {});
            }
            sendData(buffer) {
                return __awaiter(this, void 0, void 0, function*() {});
            }
            sendDataView(buffer) {
                return __awaiter(this, void 0, void 0, function*() {});
            }
        }
        Net.Client = Client;
    })(Net = Vertex.Net || (Vertex.Net = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class Structure {
            constructor(){}
            writeData(writer, delta) {}
            readData(reader) {}
            writeDataBSON(writer) {
                // Detect if this method is being directly invoked or invoked via an override method.
                if (this.writeDataBSON === Structure.prototype.writeDataBSON) {
                    console.warn("This structure does not implement writeDataBSON. An empty BSON Object will be written.", this);
                    const ctx = writer.startObject();
                    writer.endObject(ctx);
                } else console.warn(`Invoking super.writeDataBSON in is unnecessary and has performance implications`, this);
            }
            readDataBSON(reader) {
                // Detect if this method is being directly invoked or invoked via an override method.
                if (this.readDataBSON === Structure.prototype.readDataBSON) {
                    console.warn("This structure does not implement readDataBSON. An empty BSON Object will be read.", this);
                    reader.readObjectBlind();
                } else console.warn("Invoking super.readDataBSON is unnecessary and has performance implications", this);
            }
        }
        NodeComponentModel.Structure = Structure;
        class EmptyArgs extends Structure {
        }
        NodeComponentModel.EmptyArgs = EmptyArgs;
        /**
         * event bus to fire Command messages (or legacy Event messages)
         * */ class RPCEventBus extends Vertex.EventBus {
            constructor(eventName, c, isBroadcast = false){
                super();
                this.eventName = eventName;
                this.structConstructor = c;
                this.isBroadcast = isBroadcast || false;
            }
            fireWithArgs(args) {
                this.trigger(args);
            }
            fireFromData(reader) {
                const struct = new this.structConstructor();
                let didRead = false;
                if (reader instanceof Vertex.BSONReader) {
                    struct.readDataBSON(reader);
                    didRead = true;
                }
                if (reader instanceof Vertex.BinaryReader) {
                    struct.readData(reader);
                    didRead = true;
                }
                if (!didRead) throw new Error("Unrecognized Reader Type");
                this.trigger(struct);
            }
            fire(component, data) {
                // if this is a command (not broadcast)
                //   locally trigger the event if we are the token holder
                //   otherwise send event message
                // if this is a broadcast
                //   assert we are the token holder, then send broadcast message
                if (!this.isBroadcast) {
                    if (component.node.HasToken) this.trigger(data);
                    else {
                        let runtime = Vertex.Globals.getRuntime();
                        console.assert(runtime !== null, "Could not find a valid Vertex Runtime object");
                        runtime.space.spaceLink.sendRPCMessage(component.node.id, component.name, this.eventName, data);
                    }
                } else if (component.node.HasToken !== true) console.warn(`[VERTX] Not sending broadcast event because we do not control the node ${component.node.id}/${component.name}/${this.eventName}`);
                else {
                    let runtime1 = Vertex.Globals.getRuntime();
                    console.assert(runtime1 !== null, "Could not find a valid Vertex Runtime object");
                    runtime1.space.spaceLink.sendBroadcastMessage(component.node.id, component.name, this.eventName, data);
                    // todo: this might be the wrong place to do it
                    // when we send a broadcast, the server does not respond back to us,
                    // but we should fire that event synthetically on the client for consistency.
                    this.trigger(data);
                }
            }
        }
        NodeComponentModel.RPCEventBus = RPCEventBus;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
/// <reference path="space.ts"/>
/// <reference path="Websocket/client.ts"/>
/// <reference path="eventbus.ts" />
/// <reference path="BinarySerializer/binaryreader.ts" />
/// <reference path="BinarySerializer/binarywriter.ts" />
/// <reference path="ComponentModel/node.ts"/>
/// <reference path="ComponentModel/rpc.ts"/>
//Connects a VERTX space to a running instance of the runtime
var Vertex;
(function(Vertex) {
    let MessageType;
    (function(MessageType) {
        MessageType[MessageType["Test"] = 0] = "Test";
        MessageType[MessageType["Control"] = 1] = "Control";
        MessageType[MessageType["State"] = 2] = "State";
        /** Legacy RPC Command */ MessageType[MessageType["Event"] = 3] = "Event";
        MessageType[MessageType["Destroy"] = 4] = "Destroy";
        MessageType[MessageType["Create"] = 5] = "Create";
        MessageType[MessageType["AcquireToken"] = 6] = "AcquireToken";
        MessageType[MessageType["AcquireTokenResult"] = 7] = "AcquireTokenResult";
        /** Legacy Broadcast Event */ MessageType[MessageType["BroadcastEvent"] = 8] = "BroadcastEvent";
        MessageType[MessageType["ReleaseToken"] = 9] = "ReleaseToken";
        //DataChannel Messages
        MessageType[MessageType["DCSubscribe"] = 10] = "DCSubscribe";
        MessageType[MessageType["DCMessage"] = 11] = "DCMessage";
        MessageType[MessageType["DCUnsubscribe"] = 12] = "DCUnsubscribe";
        //BSON State messages
        MessageType[MessageType["BSONState"] = 13] = "BSONState";
        // Dedicated Heartbeat message
        MessageType[MessageType["Heartbeat"] = 14] = "Heartbeat";
        /** BSON RPC Command */ MessageType[MessageType["Command"] = 15] = "Command";
        MessageType[MessageType["TickRateControl"] = 16] = "TickRateControl";
        MessageType[MessageType["ServerResponse"] = 17] = "ServerResponse";
        MessageType[MessageType["ViewpointControl"] = 18] = "ViewpointControl";
        /** BSON Broadcast Event */ MessageType[MessageType["Broadcast"] = 19] = "Broadcast";
    })(MessageType = Vertex.MessageType || (Vertex.MessageType = {}));
    class TokenResult {
    }
    Vertex.TokenResult = TokenResult;
    class DataChannel {
        constructor(space){
            this.onMessage = new Vertex.EventBus();
            this.isInitialized = false;
            this.spaceLink = space.spaceLink;
        }
        init() {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.isInitialized) return;
                this.isInitialized = true;
                if (!this.spaceLink) {
                    console.error("[VERTX:DataChannel] This DataChannel does not have a valid SpaceLink");
                    return;
                }
                console.log("[VERTX:DataChannel] Creating DataChannel: " + this.id);
                yield this.spaceLink.sendDCSubscribe(this.id, this);
            });
        }
        destroy() {
            return __awaiter(this, void 0, void 0, function*() {
                if (!this.spaceLink) {
                    console.error("[VERTX:DataChannel] This DataChannel does not have a valid SpaceLink");
                    return;
                }
                yield this.spaceLink.sendDCUnsubscribe(this.id, this);
            });
        }
        sendMessage(message) {
            return __awaiter(this, void 0, void 0, function*() {
                yield this.spaceLink.sendDCMessage(this.id, message);
            });
        }
    }
    Vertex.DataChannel = DataChannel;
    class SpaceLink {
        constructor(space, client){
            this.readyEvent = new Vertex.EventBus();
            this.updateTaskId = -1;
            this.heartbeatTaskId = -1;
            this.dispatchTable = [];
            this.onTokenAcquireResult = new Vertex.EventBus();
            this.dataChannels = new Map();
            this.updateWriter = null;
            this.space = space;
            this.client = client;
            var self = this;
            var callback = ()=>{
                this.update();
            };
            //forward bind events
            this.client.openEvent.on(()=>{
                console.log("[VERTX:SpaceLink] Connected to socket");
                this.readyEvent.trigger();
                var updateRate = 1000 / 60; //set 30 tick update rate
                self.updateTaskId = setInterval(function() {
                    self.update();
                }, updateRate);
                // note: the newest space server will send heartbeat messages (type 14/0x0e) which the client
                // auto-responds with, which removes the need for this heartbeat loop.
                // however, for backwards-compatibility with older space servers, we will still manually send heartbeat
                // messages. This does not have any real drawback but is technically not necessary if the space
                // server is definitely a version that sends heartbeats.
                // note: chromium browsers run intervals at significantly reduced rates when in background,
                // which means this sort of thing isn't that reliable.
                // the newer space server (server-initiated heartbeat) fixes this issue, since chromium
                // etc will still fire websocket events in this situation, just not intervals/timeouts 
                let disableHeartbeat = sessionStorage && sessionStorage.getItem("Vertex._clientHeartbeatDisabled") || null;
                if (disableHeartbeat && disableHeartbeat != "false") console.warn(`[VERTX:SpaceLink] The 'Vertex._clientHeartbeatDisabled' debug setting is set in SessionStorage.\n` + `This may cause unexpected disconnection on some VERTX Stacks.`);
                else self.heartbeatTaskId = setInterval(function() {
                    self.sendHeartbeatMessage();
                }, 2000);
            });
            this.client.closeEvent.on(()=>{
                console.warn("[VERTX:SpaceLink] Disconnected from socket");
                if (this.updateTaskId !== -1) clearInterval(this.updateTaskId);
            });
            this.dispatchTable[MessageType.Test] = this.handleNoMessage.bind(this);
            this.dispatchTable[MessageType.Control] = this.handleNoMessage.bind(this);
            this.dispatchTable[MessageType.State] = this.handleStateMessage.bind(this);
            this.dispatchTable[MessageType.BSONState] = this.handleBSONStateMessage.bind(this);
            this.dispatchTable[MessageType.Create] = this.handleNoMessage.bind(this);
            this.dispatchTable[MessageType.Destroy] = this.handleDestroyMessage.bind(this);
            this.dispatchTable[MessageType.Event] = this.handleRPCMessage.bind(this);
            this.dispatchTable[MessageType.BroadcastEvent] = this.handleBroadcastMessage.bind(this);
            this.dispatchTable[MessageType.AcquireTokenResult] = this.handleTokenAcquireResult.bind(this);
            this.dispatchTable[MessageType.DCMessage] = this.handleDCMessage.bind(this);
            this.dispatchTable[MessageType.Heartbeat] = this.handleHeartbeatMessage.bind(this);
            this.client.dataEvent.on((buffer)=>{
                //console.log("[VERTX:SpaceLink] Got data " + buffer.byteLength + "bytes");
                self.processMessage(buffer);
            });
        }
        sendDCMessage(id, message) {
            return __awaiter(this, void 0, void 0, function*() {
                var writer = new Vertex.BinaryWriter(10240);
                writer.writeByte(MessageType.DCMessage);
                writer.writeString(id);
                writer.writeString(message);
                var buffer = writer.toBuffer();
                yield this.client.sendData(buffer);
            });
        }
        sendDCSubscribe(id, dataChannel) {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.dataChannels.has(id)) {
                    console.error("This SpaceLink already has a DataChannel with the id of: " + id);
                    return;
                }
                this.dataChannels[id] = dataChannel;
                var writer = new Vertex.BinaryWriter(4096);
                writer.writeByte(MessageType.DCSubscribe);
                writer.writeString(id);
                var buffer = writer.toBuffer();
                yield this.client.sendData(buffer);
            });
        }
        sendDCUnsubscribe(id, dataChannel) {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.dataChannels.has(id)) {
                    this.dataChannels[id] = dataChannel;
                    var writer = new Vertex.BinaryWriter(4096);
                    writer.writeByte(MessageType.DCUnsubscribe);
                    writer.writeString(id);
                    var buffer = writer.toBuffer();
                    yield this.client.sendData(buffer);
                    this.dataChannels.delete(id);
                } else {
                    console.error("This SpaceLink does not have a DataChannel with the id of: " + id);
                    return;
                }
            });
        }
        handleDCMessage(reader) {
            let channelId = reader.readString();
            let message = reader.readString();
            let channel = this.dataChannels[channelId];
            if (channel) //console.log("Got DCMessage for: " + channelId);
            //console.log(message);
            //console.log(this.dataChannels);
            channel.onMessage.trigger(message);
            else console.error("Got a DCMessage for context: " + channelId + " but that context was not found on this client");
        //if (this.dataChannels.has(channelId)) {
        //}
        }
        processMessage(buffer) {
            if (buffer.byteLength === 0) {
                console.warn("Recieved empty buffer");
                return;
            }
            var reader = new Vertex.BinaryReader(buffer);
            //reader.displayDebugContext = true;
            //reader.displayDebugState = true;
            reader.setDebugState("[VERTX:SpaceLink] Got buffer: " + buffer.byteLength + "bytes", this);
            var type = reader.readByte();
            //a jam to send the reader to the dispatcher
            var dispatchFunction = this.dispatchTable[type];
            if (typeof dispatchFunction === "function") dispatchFunction(reader);
            else console.warn(`[SpaceLink] Cannot process message type: ${type}, ignoring...`);
        //dispatchFunction.call(this, reader);
        }
        handleNoMessage(reader) {}
        handleHeartbeatMessage(reader) {
            return __awaiter(this, void 0, void 0, function*() {
                reader.setDebugState("[VERTX:SpaceLink:ControlMessage]", this);
                // note: if control messages are implemented further, they must be read properly here.
                // for now, control messages are all empty, so there's nothing to read.
                yield this.sendHeartbeatMessage();
            });
        }
        handleStateMessage(reader) {
            reader.setDebugState("[VERTX:SpaceLink:StateMessage]", this);
            this.space.readData(reader);
        }
        handleBSONStateMessage(reader) {
            reader.setDebugState("[VERTX:SpaceLink:StateMessage]", this);
            this.space.readDataBSON(new Vertex.BSONReader(reader));
        }
        sendHeartbeatMessage() {
            return __awaiter(this, void 0, void 0, function*() {
                var writer = new Vertex.BinaryWriter(1);
                writer.writeByte(MessageType.Heartbeat);
                yield this.client.sendData(writer.toBuffer());
            });
        }
        sendDeleteMessage(node) {
            return __awaiter(this, void 0, void 0, function*() {
                var writer = new Vertex.BinaryWriter(50);
                writer.writeByte(MessageType.Destroy);
                //Only support single node deletions for now, will add group deletions later
                //this functionality is mainly used by the server to clean up an exiting client.
                writer.writeInt32(1);
                writer.writeString(node.id);
                yield this.client.sendData(writer.toBuffer());
            });
        }
        handleDestroyMessage(reader) {
            reader.setDebugState("[VERTX:SpaceLink:DeleteMessage]", this);
            var numNodes = reader.readInt32();
            for(var i = 0; i < numNodes; i++){
                var nodeId = reader.readString();
                var node = this.space.findNode(nodeId);
                if (node) this.space.destroyNode(node, false);
            }
        }
        handleBroadcastMessage(reader) {
            var nodeId = reader.readString();
            var componentId = reader.readString();
            var eventName = reader.readString();
            var node = this.space.findNode(nodeId);
            //we only execute data events on nodes we actually don't own
            if (!node.HasToken) {
                var component = node.getComponent(componentId);
                var event = component.events.get(eventName);
                if (event) event.fireFromData(reader);
                else console.error(`Recieved Broadcast RPC Message for event '${eventName}' on '${componentId}' of node ${nodeId}, but no event with that name exists for that component.`, component, component.events);
            } else console.warn("Got Broadcast RPC for node with token ownership: " + nodeId);
        }
        handleRPCMessage(reader) {
            var nodeId = reader.readString();
            var componentId = reader.readString();
            var eventName = reader.readString();
            console.debug(`[VERTX:SpaceLink:handleRPCMessage] Received RPC ${nodeId}:${componentId} ${eventName}`);
            var node = this.space.findNode(nodeId);
            if (!node) console.warn(`[VERTX:SpaceLink:handleRPCMessage] Ignoring RPC '${eventName}' for ${nodeId}:${componentId} because the node does not exist locally.`);
            //we only execute data events on nodes we actually own
            if (node.HasToken) {
                var component = node.getComponent(componentId);
                if (component) {
                    var event = component.events.get(eventName);
                    if (event) event.fireFromData(reader);
                    else console.error(`[VERTX:SpaceLink:handleRPCMessage] Ignoring RPC '${eventName}' for ${nodeId}:${componentId} because the event does not exist on that component.`);
                } else console.error(`[VERTX:SpaceLink:handleRPCMessage] Ignoring RPC '${eventName}' for ${nodeId}:${componentId} because that component does not exist on that node.`);
            } else console.debug(`[VERTX:SpaceLink:handleRPCMessage] Ignoring RPC '${eventName}' for ${nodeId}:${componentId} because we don't have the token for that node.`);
        }
        sendRPCMessage(nodeId, componentId, eventId, data) {
            return __awaiter(this, void 0, void 0, function*() {
                var targetNode = this.space.findNode(nodeId);
                //don't use the wire if we're sending messages to ourself
                if (targetNode.HasToken) {
                    var component = targetNode.getComponent(componentId);
                    var event = component.events.get(eventId);
                    event.fireWithArgs(data);
                } else {
                    var writer = new Vertex.BinaryWriter(4096);
                    writer.writeByte(MessageType.Event);
                    writer.writeString(nodeId);
                    writer.writeString(componentId);
                    writer.writeString(eventId);
                    data.writeData(writer, false);
                    var buffer = writer.toBuffer();
                    yield this.client.sendData(buffer);
                }
            });
        }
        sendBroadcastMessage(nodeId, componentId, eventId, data) {
            return __awaiter(this, void 0, void 0, function*() {
                var targetNode = this.space.findNode(nodeId);
                //don't use the wire if we're sending messages to ourself
                if (targetNode.HasToken) {
                    // todo: this was never here before, is it correct?
                    var writer = new Vertex.BinaryWriter(4096);
                    writer.writeByte(MessageType.BroadcastEvent);
                    writer.writeString(nodeId);
                    writer.writeString(componentId);
                    writer.writeString(eventId);
                    data.writeData(writer, false);
                    var buffer = writer.toBuffer();
                    yield this.client.sendData(buffer);
                }
            });
        }
        handleTokenAcquireResult(reader) {
            var result = new TokenResult();
            var nodeCount = reader.readInt32();
            for(var i = 0; i < nodeCount; i++){
                result.id = reader.readString();
                result.context = reader.readString();
                result.result = reader.readBool();
                if (result.result === false) {
                    var node = this.space.findNode(result.id);
                    if (node) node.hasToken = false;
                }
                this.onTokenAcquireResult.trigger(result);
            }
        }
        sendAcquireTokenMessage(nodeId, context, policy) {
            return __awaiter(this, void 0, void 0, function*() {
                var writer = new Vertex.BinaryWriter(4096);
                writer.writeByte(MessageType.AcquireToken);
                writer.writeInt32(1);
                writer.writeString(nodeId);
                writer.writeString(context);
                writer.writeString(Vertex.NodeComponentModel.EnumAsString(policy));
                var buffer = writer.toBuffer();
                yield this.client.sendData(buffer);
            });
        }
        sendReleaseTokenMessage(nodeId, policy) {
            return __awaiter(this, void 0, void 0, function*() {
                var writer = new Vertex.BinaryWriter(4096);
                writer.writeByte(MessageType.ReleaseToken);
                writer.writeInt32(1);
                writer.writeString(nodeId);
                writer.writeString(Vertex.NodeComponentModel.EnumAsString(policy));
                var buffer = writer.toBuffer();
                yield this.client.sendData(buffer);
            });
        }
        connect() {
            return __awaiter(this, void 0, void 0, function*() {
                yield this.client.connect();
            });
        }
        update() {
            return __awaiter(this, void 0, void 0, function*() {
                //increase the size of the write buffer to 50k this will hopefully head off issues with large nodes full of text!
                if (this.updateWriter == null) this.updateWriter = new Vertex.BinaryWriter(51200);
                this.updateWriter.clear();
                //we soft reset and spin this as there can only be one and it saves tonnes of memory
                //we run both update methods in this mode
                //this should slowly drain existing scenes of Binary and BSON nodes in favour of new ones
                var writer = this.updateWriter;
                writer.Index = 0;
                let startIndex = writer.Index;
                writer.writeByte(MessageType.State);
                this.space.writeData(writer, false);
                if (writer.Index - startIndex > 5) yield this.client.sendDataView(writer.asBufferView());
                writer = this.updateWriter;
                writer.Index = 0;
                writer.writeByte(MessageType.BSONState);
                var bsonWriter = new Vertex.BSONWriter(writer);
                this.space.writeDataBSON(bsonWriter);
                if (writer.Index - startIndex > 6) yield this.client.sendDataView(writer.asBufferView());
            });
        }
    }
    Vertex.SpaceLink = SpaceLink;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let Net;
    (function(Net) {
        class WebSocketClient extends Net.Client {
            constructor(uri, spaceId){
                super(uri, spaceId);
                this.socket = null;
                this.stats = new Net.ClientStats();
            }
            connect() {
                const _super = (name)=>super[name];
                return __awaiter(this, void 0, void 0, function*() {
                    yield _super("connect").call(this);
                    var self = this;
                    return new Promise((resolve, reject)=>{
                        var urlParams = "?viewpointId=" + encodeURIComponent(this.viewpointId) + "&spaceId=" + encodeURIComponent(this.spaceId);
                        if (Vertex.Globals.bearerToken) urlParams += "&bearerToken=" + encodeURIComponent(Vertex.Globals.bearerToken);
                        this.socket = new WebSocket(this.uri + urlParams);
                        this.socket.binaryType = "arraybuffer";
                        this.socket.onclose = (evt)=>{
                            console.warn(`WebSocket Closed: (WS Code: ${evt.code}). Reason Given by Server:\n${evt.reason}`);
                            reject(`WebSocket Closed: (WS Code: ${evt.code}). Reason Given by Server:\n${evt.reason}`);
                            self.onClose(evt);
                        };
                        this.socket.onerror = (evt)=>{
                            reject(`WebSocket Error:\n${evt.type}`);
                            let errorArg = {
                                message: "A WebSocket error ocurred",
                                event: evt
                            };
                            self.onError(errorArg);
                        };
                        this.socket.onmessage = (evt)=>{
                            resolve();
                            self.onMessage(evt);
                        };
                        this.socket.onopen = (evt)=>{
                            self.onOpen(evt);
                        };
                    });
                });
            }
            disconnect() {
                const _super = (name)=>super[name];
                return __awaiter(this, void 0, void 0, function*() {
                    console.log("[Vertex:WebSocketClient] Client called disconnect");
                    yield _super("disconnect").call(this);
                    if (this.socket) this.socket.close(1000, "Client called disconnect");
                });
            }
            onClose(event) {
                this.isConnected = false;
                this.closeEvent.trigger(`Disconnect (${event.code}): ${event.reason}`);
            }
            onMessage(event) {
                if (event.data instanceof ArrayBuffer) this.dataEvent.trigger(event.data);
            }
            onOpen(event) {
                this.isConnected = true;
                this.openEvent.trigger();
            }
            onError(error) {
                this.isConnected = false;
                this.errorEvent.trigger(error);
            }
            sendData(buffer) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (!this.isConnected) return;
                    this.stats.sentMessageCount++;
                    this.stats.bytesSent += buffer.byteLength;
                    Vertex.Globals.networkStatsCallback.trigger(this.stats);
                    this.socket.send(buffer);
                });
            }
            sendDataView(buffer) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (!this.isConnected) return;
                    this.stats.sentMessageCount++;
                    this.stats.bytesSent += buffer.byteLength;
                    Vertex.Globals.networkStatsCallback.trigger(this.stats);
                    this.socket.send(buffer);
                });
            }
        }
        Net.WebSocketClient = WebSocketClient;
    })(Net = Vertex.Net || (Vertex.Net = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let SpaceDirectory;
    (function(SpaceDirectory) {
        /**
         * Perform a lookup in the Space Directory.
         * Returns 'null' upon failure.
         * @param id the space to look up
         * @param stackHost the hostname of the VERTX stack. May be accessible via Vertex.Globals.stackHost
         * @param token a bearer token to look up with.
         */ function lookupSpace(id, stackHost, token) {
            return __awaiter(this, void 0, void 0, function*() {
                if (!id) throw new Error(`id is required`);
                if (!stackHost) throw new Error(`stackHost is required`);
                let runningOnVertexCloud = location.hostname === "vertx.cloud" || location.hostname.endsWith(".vertx.cloud");
                if (!token && !runningOnVertexCloud) throw new Error(`token is required`);
                try {
                    const url = `https://${stackHost}/core/directory/space/${id}`;
                    const init = {
                        method: "POST",
                        credentials: "include",
                        headers: {} // must declare this so we can additively set them later
                    };
                    if (token) init.headers["Authorization"] = `Bearer ${token}`;
                    const response = yield fetch(url, init);
                    if (!response.ok) {
                        if (response.body) {
                            const bodyResponse = yield response.text();
                            console.warn(`[VERTX] Space Directory Lookup for '${id}' failed. (${response.status} ${response.statusText})`, bodyResponse);
                        } else console.warn(`[VERTX] Space Directory Lookup for '${id}' failed. (${response.status} ${response.statusText})`);
                        return null;
                    }
                    const body = yield response.json();
                    if (!body) throw new Error(`Directory Lookup returned unexpected value`);
                    return body;
                } catch (e) {
                    console.warn(`[VERTX] Space Directory Lookup failed. The directory API may not be available on the stack '${stackHost}'.`, e);
                    return null;
                }
            });
        }
        SpaceDirectory.lookupSpace = lookupSpace;
    })(SpaceDirectory = Vertex.SpaceDirectory || (Vertex.SpaceDirectory = {}));
})(Vertex || (Vertex = {}));
/// <reference path="BinarySerializer/iserializable.ts"/>
/// <reference path="BinarySerializer/binaryreader.ts"/>
/// <reference path="BinarySerializer/binarywriter.ts"/>
/// <reference path="ComponentModel/node.ts"/>
/// <reference path="spacelink.ts"/>
/// <reference path="guid.ts"/>
/// <reference path="Websocket/websocketclient.ts"/>
/// <reference path="runtime.ts"/>
/// <reference path="spacedirectory.ts"/>
var Vertex;
(function(Vertex) {
    //Space host, container for the running space and it's entity heirachy
    class Space {
        constructor(id, connect){
            this.nodes = new Map();
            this.defaultComponentDataType = Vertex.NodeComponentModel.ComponentDataType.BSONObject;
            this.tokenResultCallbacks = new Map();
            this.id = id;
            if (connect === true) console.warn(`[VERTX.Space] The 'connect' parameter of the Space constructor is obsolete.`);
            if (connect === false) throw new Error("The 'connect' parameter of the Space constructor is obsolete");
        }
        get Id() {
            return this.id;
        }
        get Name() {
            return this.name;
        }
        init() {
            return __awaiter(this, void 0, void 0, function*() {
                // perform directory lookup.
                const directoryResult = yield Vertex.SpaceDirectory.lookupSpace(this.id, Vertex.Globals.vertexStackUrl, Vertex.Globals.bearerToken);
                // if not found, set up a client and legacy SpaceLink with default /space/ url
                const isValidLookup = !!directoryResult && !!directoryResult.server;
                if (!isValidLookup) {
                    console.log("[VERTX] Space Directory lookup failed. Setting up Legacy SpaceLink...");
                    const spaceLink = yield this.createLegacySpaceLink(`wss://${Vertex.Globals.vertexStackUrl}/space/`);
                    this.spaceLink = spaceLink;
                }
                // if found, set up a client based on version, and use URL from directory lookup.
                if (isValidLookup) {
                    console.log(`[VERTX] Space Directory lookup succeeded. Will connect to space ${directoryResult.spaceId} on ${directoryResult.server.url} using protocol ${directoryResult.server.protocol}`);
                    switch(directoryResult.server.protocol){
                        case "wss/2.0":
                            {
                                const spaceLink1 = yield this.createSpaceLink2_0(directoryResult.server.url);
                                this.spaceLink = spaceLink1;
                                break;
                            }
                        case "wss/1.0":
                            {
                                const spaceLink2 = yield this.createLegacySpaceLink(directoryResult.server.url);
                                this.spaceLink = spaceLink2;
                                break;
                            }
                        default:
                            // unknown protocol
                            throw new Error(`The current VERTX Runtime cannot connect to this space. The protocol '${directoryResult.server.protocol}' is not supported in this version.`);
                    }
                }
                // connect spacelink
                if (this.spaceLink) {
                    this.spaceLink.onTokenAcquireResult.on(this.onAcquireTokenCallback.bind(this));
                    yield this.spaceLink.connect();
                    if (this.spaceLink instanceof Vertex.BSONSpaceLink) {
                        console.warn(`[VERTX] Setting Client Viewpoint to [0,0,0] with a radius of 100m\nFor performance, specify a smaller radius and regularly update your Viewpoint by invoking space.setClientViewpoint().`);
                        yield this.setClientViewpoint({
                            position: [
                                0,
                                0,
                                0
                            ],
                            radius: 100
                        });
                        console.log(`[VERTX] Requesting TickRate of 30Hz.\nFor higher/lower performance scenarios, invoke 'space.setClientTickrate(30)' to increase/decrease the message frequency from the space.`);
                        yield this.setClientTickrate(30);
                    }
                } else console.warn("[VERTX] No SpaceLink is specified. The space will run in offline mode.");
            });
        }
        createLegacySpaceLink(serverUrl) {
            const client = new Vertex.Net.WebSocketClient(serverUrl, this.id);
            const spaceLink = new Vertex.SpaceLink(this, client);
            return spaceLink;
        }
        createSpaceLink2_0(serverUrl) {
            const client = Vertex.Globals.runtime.createNetworkClient(serverUrl, this.id);
            const spaceLink = new Vertex.BSONSpaceLink(this, client);
            return spaceLink;
        }
        createNode(name) {
            var node = new Vertex.NodeComponentModel.VertexNode(Vertex.Globals.runtime.componentSystem, this);
            console.log("[VERTX:Space] Created local node: " + node.id);
            node.componentDataType = this.defaultComponentDataType;
            node.tokenHandoffPolicy = Vertex.NodeComponentModel.TokenHandoffPolicy.Destroy;
            node.name = name;
            node.hasToken = true;
            Vertex.Globals.event.fire("space:nodeCreated", node);
            return node;
        }
        createNodeFromData(reader) {
            var node = new Vertex.NodeComponentModel.VertexNode(Vertex.Globals.runtime.componentSystem, this);
            node.readData(reader);
            console.log("[VERTX:Space] Created node from data: " + node.id);
            Vertex.Globals.event.fire("space:nodeCreated", node);
            return node;
        }
        createNodeFromBSONData(reader) {
            var node = new Vertex.NodeComponentModel.VertexNode(Vertex.Globals.runtime.componentSystem, this);
            node.componentDataType = Vertex.NodeComponentModel.ComponentDataType.BSONObject;
            node.readDataBSON(reader);
            console.log("[VERTX:Space] Created node from data: " + node.id);
            Vertex.Globals.event.fire("space:nodeCreated", node);
            return node;
        }
        addNode(node) {
            console.log("[VERTX:Space] Added node: " + node.id);
            if (this.nodes.has(node.id)) console.error("A node with the ID of " + node.id + " was already added to the space");
            else this.nodes.set(node.id, node);
            //todo: validate this behaviour
            if (node.HasToken) {
                node.HasChanges = true;
                //manually fire this when the object is added to ensure it starts in a good state
                for (var component of node.components)node.getComponent(component).triggerOnChanged();
                //we force a connection update here so the scene is in a good state when RPC's get sent
                this.spaceLink.update();
            }
            Vertex.Globals.event.fire("space:nodeAdded", node);
        }
        addNodeAndReleaseToken(node, policy) {
            this.addNode(node);
            if (node.HasToken) node.releaseToken(policy);
        }
        destroyNode(node, propogate = true) {
            console.log("[VERTX:Space] Removed node: " + node.id);
            //we remove components backwards in case their state has additive 
            //dependencies, this is dumb, we should resolve dependencies instead
            //we might want to do this as a method on the node itself? 
            if (propogate) this.spaceLink.sendDeleteMessage(node);
            // Since reverse reverses the array in-place, AND 'removeComponent' results
            // in the component being removed from node.components, we need to make a copy to iterate over.
            let iter = node.components.slice(0, node.components.length).reverse();
            for (var id of iter)try {
                node.removeComponent(id);
            } // make sure we remove all components, even if one misbehaves
            catch (e) {
                console.error(`Unhandled error while removing ${id} Component`, {
                    error: e,
                    component: id,
                    node: node
                });
            }
            node.onDestroy.trigger(node);
            node.event.fire("onDestroy", node);
            this.nodes.delete(node.id);
            Vertex.Globals.event.fire("space:nodeDestroyed", node);
        }
        findNode(id) {
            if (this.nodes.has(id)) return this.nodes.get(id);
            return null;
        }
        acquireToken(node, policy, success) {
            var privateNode = node;
            privateNode.hasToken = true;
            node.tokenHandoffPolicy = policy;
            var nodeId = node.id;
            var context = Vertex.Guid.NewGuid();
            this.spaceLink.sendAcquireTokenMessage(nodeId, context, policy);
            this.tokenResultCallbacks[context] = success;
        }
        onAcquireTokenCallback(result) {
            var callback = this.tokenResultCallbacks[result.context];
            if (callback) callback(result);
        }
        releaseToken(node, policy) {
            var privateNode = node;
            privateNode.hasToken = false;
            node.tokenHandoffPolicy = policy;
            this.spaceLink.sendReleaseTokenMessage(node.id, policy);
        //console.log("Releasing Node");
        }
        writeData(writer, delta) {
            var dirtyNodes = [];
            for (var node of this.nodes.values()){
                if (node.doNotSerialize) continue;
                if (node.HasToken && node.HasChanges && (node.componentDataType === 0 || node.componentDataType === 1)) dirtyNodes.push(node);
            }
            writer.writeInt32(dirtyNodes.length);
            if (dirtyNodes.length > 0) {
                writer.setDebugState("[VERTX:Space]", this);
                writer.setDebugState("[VERTX:Space:" + dirtyNodes.length + " Nodes]", this);
            }
            for (var anon of dirtyNodes){
                var dirtyNode = anon;
                writer.writeString(dirtyNode.id);
                dirtyNode.writeData(writer, delta);
                dirtyNode.HasChanges = false;
            }
        }
        writeDataBSON(writer) {
            var dirtyNodes = [];
            for (var node of this.nodes.values()){
                if (node.doNotSerialize) continue;
                if (node.HasToken && node.HasChanges && node.componentDataType === Vertex.NodeComponentModel.ComponentDataType.BSONObject) dirtyNodes.push(node);
            }
            let ctx = writer.startObject();
            //if (dirtyNodes.length > 0)
            //    console.log("Writing " + dirtyNodes.length + " nodes");
            for (let dirtyNode of dirtyNodes){
                //var dirtyNode = anon as Vertex.NodeComponentModel.VertexNode;
                writer.writeObject(dirtyNode.id, dirtyNode.writeDataBSON.bind(dirtyNode));
                dirtyNode.HasChanges = false;
            }
            writer.endObject(ctx);
        }
        readData(reader) {
            var numNodes = reader.readInt32();
            if (numNodes > 0) {
                reader.setDebugState("[VERTX:Space]", this);
                reader.setDebugState("[VERTX:Space:" + numNodes + " Nodes]", this);
            }
            for(var i = 0; i < numNodes; i++){
                var nodeId = reader.readString();
                if (this.nodes.has(nodeId)) this.nodes.get(nodeId).readData(reader);
                else {
                    var node = this.createNodeFromData(reader);
                    this.addNode(node);
                }
            }
        }
        bsonReadAction(nodeId, type, reader) {
            if (nodeId === "_vertexmessagelog") {
                let logContainer = {
                    message: ""
                };
                reader.readString(logContainer, "message");
                if (logContainer.message) console.log("SpaceServerLog: ", logContainer.message);
                return;
            }
            if (this.nodes.has(nodeId)) this.nodes.get(nodeId).readDataBSON(reader);
            else {
                var node = this.createNodeFromBSONData(reader);
                this.addNode(node);
            }
        }
        readDataBSON(reader) {
            reader.readObject(this.bsonReadAction.bind(this));
        }
        /**
         * set a new client tickrate in Hz. the tickrate should be between 0-90Hz. invalid values may be rejected by the server.
         * a tickrate of 0 will pause all updates.
         *
         * this method only works for v2 spaces.
         * calling for a v1 space will throw an error, but will not cause any side effects.
         *
         * awaiting this method is not necessary unless you need confirmation that the request was sent.
         */ setClientTickrate(newTickrateHz) {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.spaceLink instanceof Vertex.BSONSpaceLink) {
                    yield this.spaceLink.sendTickrateControlMessage(newTickrateHz);
                    return;
                }
                throw new Error("The current Space does not support setting a client tickrate.");
            });
        }
        /**
         * set a viewpoint position and viewpoint radius. currently, setting both is required.
         *
         * this method only works for v2 spaces.
         * calling for a v1 space will throw an error, but will not cause any side effects.
         *
         * awaiting this method is not necessary unless you need confirmation that the request was sent.
         */ setClientViewpoint(options) {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.spaceLink instanceof Vertex.BSONSpaceLink) {
                    const { position , radius  } = options;
                    yield this.spaceLink.sendViewpointControlMessage(position, radius);
                    return;
                }
                throw new Error("The current Space does not support setting a Viewpoint.");
            });
        }
    }
    Vertex.Space = Space;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class ComponentSystem {
            constructor(){
                this.systems = new Map();
            }
            register(system) {
                if (this.systems[system.name]) {
                    console.error(`[VERTX:ComponentSystem] A controller with the name ${system.name} already exists in the ComponentSystem`);
                    return;
                }
                console.log("[VERTX:ComponentSystem] Registered component system " + system.name);
                this.systems.set(system.name, system);
            }
            override(system) {
                if (!this.systems[system.name]) {
                    console.log("[VERTX:ComponentSystem] Override of component system " + system.name);
                    this.systems.set(system.name, system);
                }
            }
            init() {
                return __awaiter(this, void 0, void 0, function*() {
                    for (var system of this.systems.values())system.init();
                });
            }
            hasComponentSystem(name) {
                return this.systems.has(name);
            }
            addComponent(name, node, instance = null) {
                var system = this.systems.get(name);
                if (!system) {
                    console.error("A controller with the name " + name + " was not found in the ComponentSystem");
                    return;
                }
                var component = system.addComponent(node, instance);
                component.name = name;
                component.node = node;
                return component;
            }
            createComponent(name) {
                var system = this.systems.get(name);
                if (!system) {
                    console.error("A controller with the name " + name + " was not found in the ComponentSystem");
                    return null;
                }
                return system.create();
            }
            getComponent(name, node) {
                var system = this.systems.get(name);
                if (!system) {
                    console.error("A controller with the name " + name + " was not found in the ComponentSystem");
                    return null;
                }
                return system.getComponent(node);
            }
            removeComponent(name, node) {
                var system = this.systems.get(name);
                if (!system) {
                    console.error("A controller with the name " + name + " was not found in the ComponentSystem");
                    return null;
                }
                return system.removeComponent(node);
            }
            update() {
                for (var system of this.systems.values())system.update();
            }
            render() {
                for (var system of this.systems.values())system.render();
            }
        }
        NodeComponentModel.ComponentSystem = ComponentSystem;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
/// <reference path="guid.ts" />
/// <reference path="eventbus.ts" />
/// <reference path="space.ts" />
/// <reference path="ComponentModel/componentsystem.ts" />
var Vertex;
(function(Vertex) {
    class VertexRuntimeTaskResult {
        constructor(message){
            this.Message = message;
        }
    }
    Vertex.VertexRuntimeTaskResult = VertexRuntimeTaskResult;
    class GraphicsEngine {
    }
    Vertex.GraphicsEngine = GraphicsEngine;
    class VertexRuntime {
        constructor(){}
        setBearerToken(token) {}
        postLoadComponentSystem() {}
        init(options) {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.isInitialized) {
                    console.warn("This instance of the runtime has already been loaded!");
                    return;
                }
                this.graphics = new GraphicsEngine();
                this.componentSystem = new Vertex.NodeComponentModel.ComponentSystem();
                this.postLoadComponentSystem();
                //this.componentSystem.register(new NodeComponentModel.TransformComponentSystem());
                //this.componentSystem.register(new NodeComponentModel.GltfModelComponentSystem());
                console.log("[VERTX:ComponentSystem] Register Component Systems");
                yield Globals.event.fire("vertex:registerComponentSystems", this.componentSystem);
                console.log("[VERTX:ComponentSystem] End Register Component Systems");
                var loadedId = Globals.spaceId;
                if (typeof loadedId === "undefined") {
                    console.warn("[VERTX:VertexRuntime] No SpaceId was set in the Globals object, using temp space id: " + loadedId);
                    loadedId = Vertex.Guid.NewGuid();
                }
                yield Vertex.Globals.event.fire("vertex:onBeforeConnect");
                this.space = new Vertex.Space(loadedId);
                try {
                    // This promise resolves as soon as we recieve a valid message, and 
                    // will be rejected if close/error happens before receiving a message.
                    // If auth fails, the socket opens but is closed immediately.
                    yield this.space.init();
                    console.log("Finished waiting for init");
                } catch (e) {
                    if (options && options.allowOffline) console.log(`[VERTX:VertexRuntime] Running in offline mode because the Space connection failed and the 'allowOffline' option was enabled.`);
                    else {
                        console.error(`[VERTX:VertexRuntime] Space Connection Failed.`);
                        throw e;
                    }
                }
                var self = this;
                Globals.event.fire("vertex:init", this);
                Globals.appContext.addEventListener("message", function(event) {
                    if (event.data && event.data.event) Globals.event.fire(event.data.event, event.data.args);
                });
                Globals.event.on("vertex:setAuthToken", function(token) {
                    console.warn("Setting a new bearer token!");
                    self.setBearerToken(token);
                });
                this.isInitialized = true;
                return new VertexRuntimeTaskResult("[VERTX:VertexRuntime] Init completed sucessfully");
            });
        }
        ///// Creates a Vertex instance without GLTFModelComponents or a graphics context
        //async InitHeadless(options?: InitOptions): Promise<VertexRuntimeTaskResult> {
        //    if (this.isInitialized) {
        //        console.warn("This instance of the runtime has already been loaded!");
        //        return;
        //    }
        //    this.componentSystem = new NodeComponentModel.ComponentSystem();
        //    var loadedId = Globals.spaceId;
        //    if (typeof loadedId === "undefined") {
        //        console.warn("[VERTX:VertexRuntime] No SpaceId was set in the Globals object, using temp space id: " + loadedId);
        //        loadedId = Guid.NewGuid();
        //    }
        //    this.space = new Space(loadedId);
        //    await this.space.init();
        //    var self = this;
        //    Globals.event.fire("vertex:init", this);
        //    Globals.appContext.addEventListener("message", function (event) {
        //        if (event.data && event.data.event) {
        //            Globals.event.fire(event.data.event, event.data.args);
        //        }
        //    });
        //    Globals.event.on("vertex:setAuthToken", function (token) {
        //        console.warn("Setting a new bearer token!");
        //        self.setBearerToken(token);
        //    });
        //    this.isInitialized = true;
        //    return new VertexRuntimeTaskResult("[VERTX:VertexRuntime] InitHeadless completed successfully");
        //}
        render() {
            return __awaiter(this, void 0, void 0, function*() {
                this.componentSystem.update();
                this.componentSystem.render();
            });
        }
        update() {
            return __awaiter(this, void 0, void 0, function*() {});
        }
        run() {
            return __awaiter(this, void 0, void 0, function*() {});
        }
        createNetworkClient(spaceServer, spaceId) {
            return new Vertex.Net.WebSocketClient(spaceServer, spaceId);
        }
    }
    Vertex.VertexRuntime = VertexRuntime;
    class Globals {
        static getRuntime() {
            return Globals.runtime;
        }
        static getEngine() {
            return Globals.runtime["engine"];
        }
    }
    Globals.canvasId = "RenderCanvas";
    Globals.vertexStackUrl = window.location.host;
    Globals.canvas = document.getElementById(Globals.canvasId);
    /**
     * reference to the current VertexRuntime.
     * NOTE: Previously typed as 'any'.
     *
     * To fix TypeScript errors, you should use Vertex.Globals.getRuntime<>() to get a reference
     * to the expected runtime. For example, Vertex.Globals.getRuntime<VertexBabylon.VertexBabylonRuntime>();
     **/ Globals.runtime = null;
    Globals.networkStatsCallback = new Vertex.EventBus();
    Globals.event = new Vertex.EventHub();
    Vertex.Globals = Globals;
})(Vertex || (Vertex = {}));
///<reference path="./Src/runtime.ts"/>
var Vertex;
(function(Vertex) {
    console.log("Loaded Vertex Runtime");
    function InitVertexHeadless(complete, options) {
        console.log("Init Runtime Headless");
        Vertex.Globals.runtime = new Vertex.VertexRuntime();
        Vertex.Globals.appContext = window;
        Vertex.Globals.runtime.init(options).then((result)=>{
            console.log(result.Message);
            complete();
        });
    }
    Vertex.InitVertexHeadless = InitVertexHeadless;
    function InitVertexHeadlessAsync(options) {
        return __awaiter(this, void 0, void 0, function*() {
            Vertex.Globals.runtime = new Vertex.VertexRuntime();
            Vertex.Globals.appContext = window;
            let result = yield Vertex.Globals.runtime.init(options);
            console.log(`Runtime Headless Init Result:`, result);
        });
    }
    Vertex.InitVertexHeadlessAsync = InitVertexHeadlessAsync;
})(Vertex || (Vertex = {}));
/// <reference path="space.ts"/>
/// <reference path="Websocket/client.ts"/>
/// <reference path="eventbus.ts" />
/// <reference path="BinarySerializer/binaryreader.ts" />
/// <reference path="BinarySerializer/binarywriter.ts" />
/// <reference path="ComponentModel/node.ts"/>
/// <reference path="ComponentModel/rpc.ts"/>
/// <reference path="spacelink.ts"/>
//Connects a VERTX space to a running instance of the runtime
var Vertex;
(function(Vertex) {
    class DestroyMessage {
        constructor(){
            this.nodes = [];
        }
        readDataBSON(reader) {
            let self = this;
            reader.readObject((name, type, _)=>{
                if (name === "nodes") reader.readArray(self, "nodes", reader.readString);
            });
        }
        writeDataBSON(writer) {
            let ctx = writer.startObject();
            writer.writeArray("nodes", this.nodes, writer.writeString);
            writer.endObject(ctx);
        }
    }
    //this seems like quite a complicated message!
    class AcquireTokenMessage {
        constructor(){
            this.actions = [];
        }
        //DONT USE THIS PATTERN USUALLY THIS ONLY WORKS HERE!
        readDataBSON(reader) {
            let self = this;
            reader.readObject((name, type, _)=>{
                if (name === "actions") {
                    self.actions = [];
                    reader.readObject((idxString, t, _)=>{
                        let idx = parseInt(idxString);
                        self.actions[idx] = new AcquireTokenAction();
                        self.actions[idx].readDataBSON(reader);
                    });
                }
            });
        }
        writeDataBSON(writer) {
            let ctx = writer.startObject();
            writer.writeObjectArray("actions", this.actions);
            writer.endObject(ctx);
        }
    }
    class AcquireTokenAction {
        readDataBSON(reader) {
            let self = this;
            reader.readObject((name, type, _)=>{
                if (name === "node") reader.readString(this, "id");
                if (name === "context") reader.readString(this, "context");
                if (name === "result") reader.readBoolean(this, "result");
                if (name === "policy") {
                    let tempString = {
                        policy: ""
                    };
                    reader.readString(tempString, "policy");
                    this.policy = Vertex.NodeComponentModel.TokenHandoffPolicy[name];
                }
            });
        }
        writeDataBSON(writer) {
            let ctx = writer.startObject();
            writer.writeString("node", this.id);
            writer.writeString("context", this.context);
            writer.writeBoolean("result", this.result);
            writer.writeString("policy", Vertex.NodeComponentModel.TokenHandoffPolicy[this.policy]);
            writer.endObject(ctx);
        }
    }
    class ReleaseTokenMessage {
        readDataBSON(reader) {
            let self = this;
            reader.readObject((name, type, _)=>{
                if (name === "id") reader.readString(this, "id");
                if (name === "policy") {
                    let tempString = {
                        policy: ""
                    };
                    reader.readString(tempString, "policy");
                    this.policy = Vertex.NodeComponentModel.TokenHandoffPolicy[name];
                }
            });
        }
        writeDataBSON(writer) {
            let ctx = writer.startObject();
            writer.writeString("id", this.id);
            writer.writeString("policy", Vertex.NodeComponentModel.TokenHandoffPolicy[this.policy]);
            writer.endObject(ctx);
        }
    }
    class CommandMessage {
        writeDataBSON(writer) {
            let ctx = writer.startObject();
            writer.writeString("node", this.node);
            writer.writeString("component", this.component);
            writer.writeString("command", this.command);
            if (this.args) writer.writeObject("args", this.args.writeDataBSON.bind(this.args));
            writer.endObject(ctx);
        }
        readDataBSON(reader) {
            reader.readObject((name, type, _reader)=>{
                if (name === "node") reader.readString(this, "node");
                if (name === "component") reader.readString(this, "component");
                if (name === "command") reader.readString(this, "command");
                if (name === "args") reader.readObjectBlind(this, "argsBson");
            });
        }
    }
    class BSONSpaceLink {
        constructor(space, client){
            this.readyEvent = new Vertex.EventBus();
            this.onTokenAcquireResult = new Vertex.EventBus();
            this.client = null;
            this.space = null;
            this.updateTaskId = -1;
            this.updateRate = 1000.0 / 60.0; //set 30 tick update rate
            this.heartbeatTaskId = -1;
            this.updateWriter = null;
            this.dispatchTable = new Map();
            this.space = space;
            //this dispatch table maps actions to specific message types from the space server
            this.dispatchTable.set(Vertex.MessageType.State, this.handleStateMessage.bind(this));
            this.dispatchTable.set(Vertex.MessageType.Destroy, this.handleDestroyMessage.bind(this));
            this.dispatchTable.set(Vertex.MessageType.AcquireTokenResult, this.handleTokenAcquireResult.bind(this));
            this.dispatchTable.set(Vertex.MessageType.Heartbeat, this.handleHeartbeatMessage.bind(this));
            this.dispatchTable.set(Vertex.MessageType.ServerResponse, this.handleServerResponseMessage.bind(this));
            this.dispatchTable.set(Vertex.MessageType.Command, this.handleCommandMessage.bind(this));
            this.dispatchTable.set(Vertex.MessageType.Broadcast, this.handleBroadcastMessage.bind(this));
            // todo: does the server send TickRateControl/ViewpointControl messages?
            this.client = client;
            this.client.openEvent.on(this.onClientOpenEvent.bind(this));
            this.client.closeEvent.on(this.onClientCloseEvent.bind(this));
            this.client.dataEvent.on(this.onClientDataEvent.bind(this));
            this.client.errorEvent.on(this.onClientErrorEvent.bind(this));
        }
        handleStateMessage(reader) {
            this.space.readDataBSON(reader);
        }
        handleDestroyMessage(reader) {
            let message = new DestroyMessage();
            message.readDataBSON(reader);
            if (message.nodes.length > 0) for (let id of message.nodes){
                let node = this.space.findNode(id);
                if (node !== null) this.space.destroyNode(node, false);
            }
        }
        handleHeartbeatMessage(reader) {
            reader.readObjectBlind();
            // respond immediately to a heartbeat request
            this.sendHeartbeatMessage();
        }
        handleServerResponseMessage(reader) {
            let serverResponseMessage = {};
            reader.readObject((name, type, _)=>{
                if (name == "message" && type == Vertex.BsonType.String) reader.readString(serverResponseMessage, "message");
                else console.warn(`[BSONSpaceLink] ServerResponse contained unrecognised BSON Property ${name}`);
            });
            console.log(`[BSONSpaceLink] %cServer Message: %c${serverResponseMessage.message}`, "font-weight: bold; color: cornflowerblue;", "color: blue;");
        }
        handleTokenAcquireResult(reader) {
            let message = new AcquireTokenAction();
            message.readDataBSON(reader);
            //console.log(message);
            if (message.context !== "null") this.onTokenAcquireResult.trigger(message);
        }
        handleCommandMessage(reader) {
            let message = new CommandMessage();
            message.readDataBSON(reader);
            const node = this.space.findNode(message.node);
            if (!node) {
                console.warn(`[BSONSpaceLink] Recieved Command message for ${message.node}/${message.component}/${message.command}, which could not be found locally.`, {
                    message
                });
                return;
            }
            if (node.HasToken !== true) {
                console.warn(`[BSONSpaceLink] Recieved Command message for ${message.node}/${message.component}/${message.command}, which we currently do not control.`, {
                    message,
                    node
                });
                return;
            }
            const component = node.getComponent(message.component);
            if (!component) {
                console.warn(`[BSONSpaceLink] Recieved Command message for ${message.node}/${message.component}/${message.command}, which the component is not recognized.`, {
                    message,
                    node
                });
                return;
            }
            const func = component.events.get(message.command);
            if (!func) {
                console.warn(`[BSONSpaceLink] Recieved Command message for ${message.node}/${message.component}/${message.command}, which does not contain this event locally.\n
The sender's component assembly may not match the local one.`, {
                    message,
                    node,
                    component
                });
                return;
            }
            // deserialize args and fire
            const binaryReader = new Vertex.BinaryReader(message.argsBson.buffer);
            const bsonReader = new Vertex.BSONReader(binaryReader);
            func.fireFromData(bsonReader);
        }
        handleBroadcastMessage(reader) {
            let message = new CommandMessage();
            message.readDataBSON(reader);
            const node = this.space.findNode(message.node);
            if (!node) {
                console.warn(`[BSONSpaceLink] Recieved Broadcast message for ${message.node}/${message.component}/${message.command}, which could not be found locally.`, {
                    message
                });
                return;
            }
            if (node.HasToken === true) {
                console.warn(`[BSONSpaceLink] Recieved Broadcast message for ${message.node}/${message.component}/${message.command}, which we currently control.`, {
                    message,
                    node
                });
                return;
            }
            const component = node.getComponent(message.component);
            if (!component) {
                console.warn(`[BSONSpaceLink] Recieved Broadcast message for ${message.node}/${message.component}/${message.command}, which the component is not recognized.`, {
                    message,
                    node
                });
                return;
            }
            const func = component.events.get(message.command);
            if (!func) {
                console.warn(`[BSONSpaceLink] Recieved Broadcast message for ${message.node}/${message.component}/${message.command}, which does not contain this event locally.\n
The sender's component assembly may not match the local one.`, {
                    message,
                    node,
                    component
                });
                return;
            }
            // deserialize args and fire
            const binaryReader = new Vertex.BinaryReader(message.argsBson.buffer);
            const bsonReader = new Vertex.BSONReader(binaryReader);
            func.fireFromData(bsonReader);
        }
        onClientErrorEvent(errorData) {
            // todo: this is awful
            console.error("[VERTX:BSONSpaceLink] A WebSocket Error Occurred", errorData);
        }
        onClientOpenEvent() {
            console.log("[VERTX:BSONSpaceLink] Connected to socket");
            this.readyEvent.trigger();
            this.updateTaskId = setInterval((function() {
                this.update();
            }).bind(this), this.updateRate);
            let disableHeartbeat = sessionStorage && sessionStorage.getItem("Vertex._clientHeartbeatDisabled") || null;
            if (disableHeartbeat && disableHeartbeat != "false") console.warn(`[VERTX:BSONSpaceLink] The 'Vertex._clientHeartbeatDisabled' debug setting is set in SessionStorage.\n` + `This may cause unexpected disconnection on some VERTX Stacks.`);
            else this.heartbeatTaskId = setInterval((function() {
                this.sendHeartbeatMessage();
            }).bind(this), 2000);
        }
        onClientCloseEvent() {
            console.warn("[VERTX:BSONSpaceLink] Disconnected from socket");
            if (this.updateTaskId !== -1) clearInterval(this.updateTaskId);
        }
        onClientDataEvent(data) {
            let reader = new Vertex.BinaryReader(data);
            let bsonReader = new Vertex.BSONReader(reader);
            let dispatchMethod = null;
            bsonReader.readObject((name, type, reader)=>{
                let messageKey = Vertex.MessageType[name];
                dispatchMethod = this.dispatchTable.get(messageKey);
                // console.debug(`[BSONSpaceLink] TRACE ClientDataEvent of type ${name} (${messageKey})`);
                // use the appropriate BSON reader for recognised message types
                if (typeof dispatchMethod === "function") dispatchMethod(reader);
                else {
                    console.debug(`[BSONSpaceLink] Unknown ClientDataEvent ${name} (${messageKey}) - skipping message...`);
                    reader.readObjectBlind();
                }
            });
        }
        connect() {
            return __awaiter(this, void 0, void 0, function*() {
                console.log("[VERTX:BSONSpaceLink] Connecting...");
                yield this.client.connect();
            });
        }
        update() {
            return __awaiter(this, void 0, void 0, function*() {
                yield this.createUpdateMessage();
            });
        }
        createUpdateMessage() {
            return __awaiter(this, void 0, void 0, function*() {
                if (this.updateWriter == null) this.updateWriter = new Vertex.BinaryWriter(51200);
                this.updateWriter.clear();
                this.updateWriter.Index = 0;
                let writer = new Vertex.BSONWriter(this.updateWriter);
                let ctx = writer.startObject();
                let idx = writer.writer.Index;
                //todo add any token handoff or event logic here
                yield this.sendStateMessage(writer);
                let updateSize = writer.writer.Index - idx;
                writer.endObject(ctx);
                if (updateSize > 14) this.client.sendDataView(this.updateWriter.asBufferView());
            });
        }
        sendStateMessage(writer) {
            return __awaiter(this, void 0, void 0, function*() {
                writer.writeObject("State", this.space.writeDataBSON.bind(this.space));
            });
        }
        _writeEmptyObject(writer) {
            const ctx = writer.startObject();
            writer.endObject(ctx);
        }
        sendHeartbeatMessage() {
            return __awaiter(this, void 0, void 0, function*() {
                const binaryWriter = new Vertex.BinaryWriter(64);
                const writer = new Vertex.BSONWriter(binaryWriter);
                const ctx = writer.startObject();
                // heartbeat object contains nothing
                writer.writeObject("Heartbeat", this._writeEmptyObject);
                writer.endObject(ctx);
                //console.debug("[BSONSpaceLink] TRACE Sending heartbeat message...")
                yield this.client.sendDataView(binaryWriter.asBufferView());
            });
        }
        sendDCMessage(id, message) {
            return __awaiter(this, void 0, void 0, function*() {
                console.warn("[BSONSpaceLink] sendDCMessage is not implemented");
            });
        }
        sendDCSubscribe(id, dataChannel) {
            return __awaiter(this, void 0, void 0, function*() {
                console.warn("[BSONSpaceLink] sendDCSubscribe is not implemented");
            });
        }
        sendDCUnsubscribe(id, dataChannel) {
            return __awaiter(this, void 0, void 0, function*() {
                console.warn("[BSONSpaceLink] sendDCUnsubscribe is not implemented");
            });
        }
        sendDeleteMessage(node) {
            return __awaiter(this, void 0, void 0, function*() {
                let message = new DestroyMessage();
                message.nodes.push(node.id);
                if (this.updateWriter == null) this.updateWriter = new Vertex.BinaryWriter(51200);
                this.updateWriter.clear();
                this.updateWriter.Index = 0;
                let writer = new Vertex.BSONWriter(this.updateWriter);
                let ctx = writer.startObject();
                writer.writeObject("Destroy", message.writeDataBSON.bind(message));
                writer.endObject(ctx);
                this.client.sendDataView(this.updateWriter.asBufferView());
            });
        }
        sendRPCMessage(nodeId, componentId, eventId, data) {
            return __awaiter(this, void 0, void 0, function*() {
                // in BSONSpaceLink, RPCs are sent as BSON 'Command' Messages only
                const message = new CommandMessage();
                message.node = nodeId;
                message.component = componentId;
                message.command = eventId;
                message.args = data;
                const updateWriter = new Vertex.BinaryWriter(8192);
                const writer = new Vertex.BSONWriter(updateWriter);
                const ctx = writer.startObject();
                writer.writeObject("Command", message.writeDataBSON.bind(message));
                writer.endObject(ctx);
                this.client.sendDataView(updateWriter.asBufferView());
            });
        }
        sendBroadcastMessage(nodeId, componentId, eventId, data) {
            return __awaiter(this, void 0, void 0, function*() {
                // in BSONSpaceLink, Broadcasts are sent as BSON 'Broadcast' Messages only
                const message = new CommandMessage();
                message.node = nodeId;
                message.component = componentId;
                message.command = eventId;
                message.args = data;
                const updateWriter = new Vertex.BinaryWriter(8192);
                const writer = new Vertex.BSONWriter(updateWriter);
                const ctx = writer.startObject();
                writer.writeObject("Broadcast", message.writeDataBSON.bind(message));
                writer.endObject(ctx);
                this.client.sendDataView(updateWriter.asBufferView());
            });
        }
        sendAcquireTokenMessage(nodeId, context, policy) {
            return __awaiter(this, void 0, void 0, function*() {
                let action = new AcquireTokenAction();
                action.id = nodeId;
                action.context = context;
                action.policy = policy;
                action.result = true;
                let message = new AcquireTokenMessage();
                message.actions.push(action);
                if (this.updateWriter == null) this.updateWriter = new Vertex.BinaryWriter(51200);
                this.updateWriter.clear();
                this.updateWriter.Index = 0;
                let writer = new Vertex.BSONWriter(this.updateWriter);
                let ctx = writer.startObject();
                writer.writeObject("AcquireToken", message.writeDataBSON.bind(message));
                writer.endObject(ctx);
                this.client.sendDataView(this.updateWriter.asBufferView());
            });
        }
        sendReleaseTokenMessage(nodeId, policy) {
            return __awaiter(this, void 0, void 0, function*() {
                let message = new ReleaseTokenMessage();
                message.id = nodeId;
                message.policy = policy;
                if (this.updateWriter == null) this.updateWriter = new Vertex.BinaryWriter(51200);
                this.updateWriter.clear();
                this.updateWriter.Index = 0;
                let writer = new Vertex.BSONWriter(this.updateWriter);
                let ctx = writer.startObject();
                writer.writeObject("ReleaseToken", message.writeDataBSON.bind(message));
                writer.endObject(ctx);
                this.client.sendDataView(this.updateWriter.asBufferView());
            });
        }
        sendTickrateControlMessage(newTickrateHz) {
            return __awaiter(this, void 0, void 0, function*() {
                const binaryWriter = new Vertex.BinaryWriter(64);
                const writer = new Vertex.BSONWriter(binaryWriter);
                const ctx = writer.startObject();
                writer.writeObject("TickRateControl", (_writer)=>{
                    let _ctx = _writer.startObject();
                    _writer.writeDouble("frequencyHz", newTickrateHz);
                    _writer.endObject(_ctx);
                });
                writer.endObject(ctx);
                yield this.client.sendDataView(binaryWriter.asBufferView());
            });
        }
        sendViewpointControlMessage(position, radius) {
            return __awaiter(this, void 0, void 0, function*() {
                const binaryWriter = new Vertex.BinaryWriter(256);
                const writer = new Vertex.BSONWriter(binaryWriter);
                const ctx = writer.startObject();
                writer.writeObject("ViewpointControl", (_writer)=>{
                    let _ctx = _writer.startObject();
                    if (Array.isArray(position) && position.length === 3) _writer.writeArray("position", position, _writer.writeDouble);
                    if (typeof radius === "number") _writer.writeDouble("radius", radius);
                    _writer.endObject(_ctx);
                });
                writer.endObject(ctx);
                yield this.client.sendDataView(binaryWriter.asBufferView());
            });
        }
    }
    Vertex.BSONSpaceLink = BSONSpaceLink;
})(Vertex || (Vertex = {}));
class Transform {
    constructor(position, rotation, scale){
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
}
/// <reference path="../BinarySerializer/binaryreader.ts"/>
/// <reference path="../BinarySerializer/binarywriter.ts"/>
var Vertex;
(function(Vertex) {
    let BsonType;
    (function(BsonType) {
        BsonType[BsonType["Double"] = 1] = "Double";
        BsonType[BsonType["String"] = 2] = "String";
        BsonType[BsonType["Object"] = 3] = "Object";
        BsonType[BsonType["Array"] = 4] = "Array";
        BsonType[BsonType["Binary"] = 5] = "Binary";
        BsonType[BsonType["Undefined"] = 6] = "Undefined";
        BsonType[BsonType["Oid"] = 7] = "Oid";
        BsonType[BsonType["Boolean"] = 8] = "Boolean";
        BsonType[BsonType["Date"] = 9] = "Date";
        BsonType[BsonType["Null"] = 10] = "Null";
        BsonType[BsonType["Regex"] = 11] = "Regex";
        BsonType[BsonType["Reference"] = 12] = "Reference";
        BsonType[BsonType["Code"] = 13] = "Code";
        BsonType[BsonType["Symbol"] = 14] = "Symbol";
        BsonType[BsonType["CodeWScope"] = 15] = "CodeWScope";
        BsonType[BsonType["Int32"] = 16] = "Int32";
        BsonType[BsonType["Int64"] = 18] = "Int64";
        BsonType[BsonType["TimeStamp"] = 17] = "TimeStamp";
        //Vertex Specific Extensions
        BsonType[BsonType["Single"] = 19] = "Single";
        BsonType[BsonType["Int16"] = 20] = "Int16";
        BsonType[BsonType["Uint8"] = 21] = "Uint8";
        BsonType[BsonType["UInt16"] = 22] = "UInt16";
        BsonType[BsonType["UInt32"] = 23] = "UInt32";
        BsonType[BsonType["UInt64"] = 24] = "UInt64";
        BsonType[BsonType["MinKey"] = -1] = "MinKey";
        BsonType[BsonType["MaxKey"] = 127] = "MaxKey";
    })(BsonType = Vertex.BsonType || (Vertex.BsonType = {}));
    class BSONWriter {
        constructor(writer){
            this.writer = null;
            this.writer = writer;
        }
        writeInt16(name, value) {
            this.writer.writeByte(BsonType.Int16);
            this.writerCStringInternal(name);
            this.writer.writeInt16(value);
        }
        writeInt32(name, value) {
            this.writer.writeByte(BsonType.Int32);
            this.writerCStringInternal(name);
            this.writer.writeInt32(value);
        }
        writeInt64(name, value) {
            console.error("this platform cannot encode 64 bit number as of yet");
        }
        writeUInt16(name, value) {
            this.writer.writeByte(BsonType.UInt16);
            this.writerCStringInternal(name);
            this.writer.writeUInt16(value);
        }
        writeUInt32(name, value) {
            this.writer.writeByte(BsonType.UInt32);
            this.writerCStringInternal(name);
            this.writer.writeUInt32(value);
        }
        writeUInt64(name, value) {
            console.error("this platform cannot encode 64 bit number as of yet");
        }
        writeSingle(name, value) {
            this.writer.writeByte(BsonType.Double);
            this.writerCStringInternal(name);
            this.writer.writeDouble(value);
        }
        writeDouble(name, value) {
            this.writer.writeByte(BsonType.Double);
            this.writerCStringInternal(name);
            this.writer.writeDouble(value);
        }
        writeString(name, value) {
            this.writer.writeByte(BsonType.String);
            this.writerCStringInternal(name);
            var stringEncoded = Vertex.UTF8.Encode(value);
            this.writer.writeInt32(stringEncoded.length + 1);
            this.writer.writeBytes(stringEncoded, stringEncoded.length);
            this.writer.writeByte(0x0);
        }
        writeArray(name, array, writeAction) {
            writeAction = writeAction.bind(this);
            this.writer.writeByte(BsonType.Array);
            this.writerCStringInternal(name);
            let ctx = this.startObject();
            for(let i = 0; i < array.length; i++)writeAction(i.toFixed(0).toString(), array[i]);
            this.endObject(ctx);
        }
        writeObjectArray(name, array) {
            this.writer.writeByte(BsonType.Array);
            this.writerCStringInternal(name);
            let ctx = this.startObject();
            for(let i = 0; i < array.length; i++)this.writeObject(i.toFixed(0).toString(), array[i].writeDataBSON.bind(array[i]));
            this.endObject(ctx);
        }
        writeBoolean(name, value) {
            this.writer.writeByte(BsonType.Boolean);
            this.writerCStringInternal(name);
            this.writer.writeByte(value ? 0x1 : 0x0);
        }
        /**
         * write an object header to the BSON Writer, then executes 'writerFunction'
         * e.g. writes 0x03, followed by a BSON c_string form of the 'name' parameter.
         * @param name
         * @param writerFunction
         */ writeObject(name, writerFunction) {
            this.writer.writeByte(BsonType.Object);
            this.writerCStringInternal(name);
            writerFunction(this);
        }
        /**
         * writes a BSON Object Header, then writes the provided bsonDocument as the complete object body.
         *
         * bsonDocument MUST be a complete BSON document, including the size at the start, and the 0x0 end marker.
         */ writeObjectBlind(name, bsonDocument) {
            this.writer.writeByte(BsonType.Object);
            this.writerCStringInternal(name);
            this.writer.writeBytes(bsonDocument, bsonDocument.length);
        }
        startObject() {
            return this.beginBoundedSection();
        }
        endObject(context) {
            this.writer.writeByte(0x0);
            let size = this.endBoundedSection(context);
        }
        beginBoundedSection() {
            let idx = this.writer.Index;
            this.writer.writeInt32(0);
            return idx;
        }
        endBoundedSection(context) {
            let currentPos = this.writer.Index;
            let size = currentPos - context;
            this.writer.Index = context;
            this.writer.writeInt32(size);
            this.writer.Index = currentPos;
            return size;
        }
        writerCStringInternal(value) {
            var stringEncoded = Vertex.UTF8.Encode(value);
            this.writer.writeBytes(stringEncoded, stringEncoded.length);
            this.writer.writeByte(0x0);
        }
    }
    Vertex.BSONWriter = BSONWriter;
    class BSONReader {
        constructor(reader){
            this.reader = null;
            this.reader = reader;
        }
        getTypeSize(type) {
            switch(type){
                case 0:
                    return 0;
                case BsonType.Double:
                    return 8;
                case BsonType.String:
                    {
                        let position = this.reader.Index;
                        let size = this.reader.readInt32() + 4;
                        this.reader.Index = position;
                        return size;
                    }
                case BsonType.Object:
                    {
                        let position1 = this.reader.Index;
                        let size1 = this.reader.readInt32();
                        this.reader.Index = position1;
                        return size1;
                    }
                case BsonType.Array:
                    {
                        let position2 = this.reader.Index;
                        let size2 = this.reader.readInt32();
                        this.reader.Index = position2;
                        return size2;
                    }
                case BsonType.Boolean:
                    return 1;
                case BsonType.Int32:
                    return 4;
                case BsonType.Int64:
                    return 8;
                case BsonType.Single:
                    return 4;
                case BsonType.Int16:
                    return 2;
                case BsonType.Uint8:
                    return 1;
                case BsonType.UInt16:
                    return 2;
                case BsonType.UInt32:
                    return 4;
                case BsonType.UInt64:
                    return 8;
                default:
                    console.error("Attempted to deserialize BSON type: " + type + " which is not supported by this serializer");
                    return 0;
            }
        }
        readCStringInteral() {
            let bytes = [];
            let char = this.reader.readByte();
            while(char != 0x0){
                bytes.push(char);
                char = this.reader.readByte();
            }
            return Vertex.UTF8.Decode(bytes);
        }
        readInt16(target, property) {
            target[property] = this.reader.readInt16();
        }
        readInt32(target, property) {
            target[property] = this.reader.readInt32();
        }
        readInt64(target, property) {
            console.error("BSON Reader: This platform does not support property type Int64");
        }
        readUInt16(target, property) {
            target[property] = this.reader.readUInt16();
        }
        readUInt32(target, property) {
            target[property] = this.reader.readUInt32();
        }
        readUInt64(target, property) {
            console.error("BSON Reader: This platform does not support property type UInt64");
        }
        readSingle(target, property) {
            target[property] = this.reader.readDouble();
        }
        readDouble(target, property) {
            target[property] = this.reader.readDouble();
        }
        readString(target, property) {
            target[property] = this.readStringInternal();
        }
        readEnum(target, property, lookupTable) {
            let internalString = this.readStringInternal();
            for(var i = 0; i < lookupTable.length; i++)if (lookupTable[i] == internalString) target[property] = i;
        }
        readStringInternal() {
            let stringLength = this.reader.readInt32(); //length int32
            let stringBytes = this.reader.readBytes(stringLength - 1); //char* - the additional null char
            if (this.reader.readByte() != 0x0) console.error("BSON Reader: Malformed string detected in BSON string bytestream");
            return Vertex.UTF8.Decode(stringBytes);
        }
        readBoolean(target, property) {
            target[property] = this.reader.readByte() === 0x01 ? true : false;
        }
        readArray(target, property, readAction) {
            readAction = readAction.bind(this);
            let targetArray = target[property];
            let elementCount = 0;
            this.readObject((currentIdx, type, innerReader)=>{
                if (targetArray.length < elementCount + 1) targetArray.push(null);
                readAction(targetArray, parseInt(currentIdx));
                elementCount++;
            });
            if (targetArray.length > elementCount) target[property] = targetArray.slice(0, elementCount);
            return;
        //let startingPosition = this.reader.Index;
        //let arraySize = 0;
        //let dump = { cache: null };
        //this.readObject((name, type, innerReader) => {
        //    arraySize++;
        //    readAction(dump, "cache");
        //});
        //if (!targetArray || targetArray.length !== arraySize) {
        //    target[property] = new Array(arraySize);
        //    targetArray = target[property] as any[];
        //}
        //this.reader.Index = startingPosition;
        ////console.log("Array of " + arraySize + " elements");
        //this.readObject((currentIdx, type, innerReader) => {
        //    readAction(targetArray, currentIdx);
        //});
        }
        readObjectBlind(target, property) {
            // if no target is provided, just skip the reader.
            // otherwise, we should output the raw data to target[property]
            const shouldSkip = typeof target === "undefined";
            if (shouldSkip) {
                //the length of the document
                let size = this.reader.readInt32();
                size -= 4;
                const start = this.reader.Index;
                this.reader.skipAhead(size - 1);
                const endMarker = this.reader.readByte();
                if (endMarker != 0x0) console.warn("[BSONReader] BSON document did not properly deserialize!");
                const readerSize = this.reader.Index - start + 5;
                if (readerSize !== size + 5) console.warn("[BSONReader] BSON Reader did not read the correct number of bytes for the document");
            } else {
                // peek the length, then dump the entire contents into data.
                const size1 = this.reader.readInt32();
                this.reader.skipAhead(-4); // 4 === sizeof Int32
                // safety check
                if (size1 > 32768) {
                    console.warn(`[BSONReader] Refusing to blind read large (>32M) BSON object (Declared Size: ${size1} bytes)`);
                    // fall back to blind read
                    return this.readObjectBlind(undefined, undefined);
                }
                const data = this.reader.readBytes(size1);
                // assert that the last byte is an end marker
                const endMarker1 = data[data.length - 1];
                if (endMarker1 !== 0x0) console.warn("[BSONReader] BSON document did not properly deserialize!", {
                    document: data,
                    detectedEndMarker: endMarker1
                });
                target[property] = data;
            }
        }
        readObject(readAction) {
            //the length of the document
            let size = this.reader.readInt32();
            size -= 4;
            if (size === 0) {
                this.reader.readByte();
                return;
            }
            let idx = 0;
            //console.log(size);
            let start = this.reader.Index;
            while(idx < size - 1){
                let type = this.reader.readByte();
                let name = this.readCStringInteral();
                let startPosition = this.reader.Index;
                let expectedSize = this.getTypeSize(type);
                readAction(name, type, this);
                if (this.reader.Index === startPosition && expectedSize > 0) //console.warn("Skipping ahead: " + name + " Expected Size: " + expectedSize);
                this.reader.skipAhead(expectedSize);
                idx = this.reader.Index - start;
            }
            let endMarker = this.reader.readByte();
            if (endMarker != 0x0) console.warn("BSON document did not properly deserialize!");
            let readerSize = this.reader.Index - start + 5;
            if (readerSize !== size + 5) console.warn("BSON Reader did not read the correct number of bytes for the document");
        }
    }
    Vertex.BSONReader = BSONReader;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    class UTF8 {
        static Encode(str) {
            var utf8 = [];
            for(var i = 0; i < str.length; i++){
                var charcode = str.charCodeAt(i);
                if (charcode < 0x80) utf8.push(charcode);
                else if (charcode < 0x800) utf8.push(0xc0 | charcode >> 6, 0x80 | charcode & 0x3f);
                else if (charcode < 0xd800 || charcode >= 0xe000) utf8.push(0xe0 | charcode >> 12, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
                else {
                    i++;
                    charcode = (charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff;
                    utf8.push(0xf0 | charcode >> 18, 0x80 | charcode >> 12 & 0x3f, 0x80 | charcode >> 6 & 0x3f, 0x80 | charcode & 0x3f);
                }
            }
            return utf8;
        }
        static Decode(data) {
            var str = "";
            var i;
            for(i = 0; i < data.length; i++){
                var value = data[i];
                if (value < 0x80) str += String.fromCharCode(value);
                else if (value > 0xBF && value < 0xE0) {
                    str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                    i += 1;
                } else if (value > 0xDF && value < 0xF0) {
                    str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                    i += 2;
                } else {
                    var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;
                    str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                    i += 3;
                }
            }
            return str;
        }
    }
    Vertex.UTF8 = UTF8;
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class ComponentViewBase {
            update() {}
            render() {}
        }
        NodeComponentModel.ComponentViewBase = ComponentViewBase;
        class EmptyComponentView extends ComponentViewBase {
            addComponent(component, node) {}
            removeComponent(component, node) {}
            update() {}
            render() {}
        }
        NodeComponentModel.EmptyComponentView = EmptyComponentView;
        class ComponentControllerBase {
            update() {}
            render() {}
        }
        NodeComponentModel.ComponentControllerBase = ComponentControllerBase;
        class EmptyComponentController extends ComponentControllerBase {
            constructor(){
                super();
            }
            addComponent(component, node) {}
            removeComponent(component, node) {}
        }
        NodeComponentModel.EmptyComponentController = EmptyComponentController;
        class ComponentSystemBase {
            constructor(name, view, controller){
                this.components = new Map();
                this.name = name;
                this.view = view;
                this.controller = controller;
            }
            init() {}
            update() {
                this.controller.update();
                this.view.update();
            }
            render() {
                this.controller.render();
                this.view.render();
            }
            addComponent(node, instance = null) {
                if (this.components.has(node.id)) return this.components.get(node.id);
                var component = instance === null ? this.create() : instance;
                this.components.set(node.id, component);
                this.view.addComponent(component, node);
                if (node.HasToken) this.controller.addComponent(component, node);
                return component;
            }
            getComponent(node) {
                if (this.components.has(node.id)) return this.components.get(node.id);
                return null;
            }
            removeComponent(node) {
                if (this.components.has(node.id)) {
                    var component = this.components.get(node.id);
                    component.onRemoved.trigger();
                    this.view.removeComponent(component, node);
                    this.controller.removeComponent(component, node);
                    this.components.delete(node.id);
                }
            }
        }
        NodeComponentModel.ComponentSystemBase = ComponentSystemBase;
        class EmptyComponentSystem extends ComponentSystemBase {
            constructor(componentClass){
                //cut the word Component off the end as described
                var componentName = componentClass.name;
                if (componentName.endsWith("Component")) componentName = componentName.substring(0, componentName.length - 9);
                super(componentName, new EmptyComponentView(), new EmptyComponentController());
                this.componentClass = componentClass;
                console.log(`[VERTX:EmtpyComponentSystem] Created EmptyComponentSystem for ${componentName}`, {
                    class: componentClass,
                    name: componentName,
                    componentSystem: this
                });
            }
            create() {
                if (this.componentClass) {
                    let instance = new this.componentClass();
                    return instance;
                } else console.error("[VERTX:EmtpyComponentSystem:create] Could not initialize constructor for " + this.name);
            }
        }
        NodeComponentModel.EmptyComponentSystem = EmptyComponentSystem;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        const transactionCharSet = "bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ_-";
        const transactionStrLen = 16;
        function generateTransaction() {
            let str = "";
            for(let i = 0; i < transactionStrLen; ++i){
                let idx = Math.round(Math.random() * (transactionCharSet.length - 1));
                str += transactionCharSet.charAt(idx);
            }
            return str;
        }
        function assertJanus(first, second) {
            if (first.janus != second.janus) throw new Error(`Unexpected response`);
        }
        function assertMatchingTransaction(first, second) {
            if (first.transaction != second.transaction) throw new Error("Wrong transaction");
        }
        function assertSuccess(response) {
            if (response.statusCode < 200 || response.statusCode >= 300) {
                console.log("Janus non-success status", response);
                throw new Error("Expected success status");
            }
            let janus = response.body && response.body.janus;
            if (janus && janus == "error") {
                console.log("Janus error response", response);
                throw new Error("Expected non-error janus response");
            }
        }
        class JanusApi {
            /**
             *
             * @param vertexStackBase stackUrl with protocol and trailing slash, eg. 'https://vertx.cloud/'
             */ constructor(vertexStackBase){
                this.janusBase = `${vertexStackBase}webrtc/`;
            }
            setBearerToken(token) {
                this.token = token;
            }
            prepareInit(method) {
                let init = {};
                init.method = method;
                init.headers = {
                    "Content-Type": "application/json"
                };
                init.credentials = "same-origin";
                if (this.token) {
                    init.credentials = "include";
                    init.headers["Authorization"] = `Bearer ${this.token}`;
                }
                return init;
            }
            createVertexWebRtcSessionAsync(spaceId, viewpointId, debugVp8Test, debugH264Test) {
                return __awaiter(this, void 0, void 0, function*() {
                    var api = `${this.janusBase}join`;
                    var qparams = [
                        `spaceId=${encodeURIComponent(spaceId)}`,
                        `viewpointId=${encodeURIComponent(viewpointId)}`
                    ];
                    if (debugVp8Test) qparams.push(`debugvp8room=true`);
                    if (debugH264Test) qparams.push(`debugh264room=true`);
                    var query = qparams.join("&");
                    var uri = `${api}?${query}`;
                    let init = this.prepareInit("post");
                    let resp = yield fetch(uri, init);
                    var result = yield resp.json();
                    return result;
                });
            }
            sendVertexKeepAlive(spaceId, viewpointId, sessionId) {
                return __awaiter(this, void 0, void 0, function*() {
                    var api = `${this.janusBase}join/keepalive`;
                    var qparams = [
                        `spaceId=${encodeURIComponent(spaceId)}`,
                        `viewpointId=${encodeURIComponent(viewpointId)}`,
                        `sessionId=${sessionId}`
                    ];
                    var query = qparams.join("&");
                    var uri = `${api}?${query}`;
                    let init = this.prepareInit("post");
                    let resp = yield fetch(uri, init);
                    return resp.ok;
                });
            }
            getSessionInfoAsync(jSession) {
                return __awaiter(this, void 0, void 0, function*() {
                    var result = {
                        responseBody: null,
                        error: null
                    };
                    try {
                        let url = `${this.janusBase}janus/${jSession}`;
                        let response = yield this.sendJanusRequestGet(url);
                        if (response && response.body) result.responseBody = response.body;
                        else throw new Error("Unexpected response from server");
                    } catch (e) {
                        result.error = e;
                    }
                    return result;
                });
            }
            createVideoRoomPluginHandle(jsession) {
                return __awaiter(this, void 0, void 0, function*() {
                    var result = {
                        handle: 0,
                        error: null
                    };
                    try {
                        var message = {
                            janus: "attach",
                            plugin: "janus.plugin.videoroom",
                            transaction: generateTransaction()
                        };
                        var response = yield this.sendJanusSessionRequest(jsession, message);
                        assertSuccess(response);
                        var body = response.body;
                        assertSuccess(body);
                        assertMatchingTransaction(message, body);
                        // conveniently, this uses the same format as the 'create session' response: 
                        // the plugin handle is stored in data.id
                        result.handle = body.data.id;
                        console.debug("[WebRTC] Created videoroom session", body);
                    } catch (e) {
                        result.error = e;
                    }
                    return result;
                });
            }
            detachPluginHandle(jsession, handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    var result = {
                        handle: 0,
                        error: null
                    };
                    try {
                        var message = {
                            janus: "detach",
                            transaction: generateTransaction()
                        };
                        var response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        var body = response.body;
                        assertSuccess(body);
                        assertMatchingTransaction(message, body);
                    } catch (e) {
                        result.error = e;
                    }
                    return result;
                });
            }
            joinVideoRoomAsPublisher(jsession, handle, roomId, displayName) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "join",
                                ptype: "publisher",
                                room: roomId,
                                display: displayName
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Joined as publisher", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            leaveVideoRoom(jsession, handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "leave"
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Left videoroom", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            videoRoomSubscribe(session, handle, publisherId, roomId, enableRemoteAudio, enableRemoteVideo) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        if (handle == 0) throw new Error("invalid handle");
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "join",
                                ptype: "subscriber",
                                room: roomId,
                                feed: publisherId,
                                audio: enableRemoteAudio,
                                video: enableRemoteVideo,
                                offer_audio: enableRemoteAudio,
                                offer_video: enableRemoteVideo,
                                // don't close the peerconnection when the publisher leaves.
                                // this is important, as it keeps the view's peerconnection with janus active, allowing that view to
                                // switch to another subscription. This is useful if the publisher's internet drops and they re-publish
                                // but they don't necessarily create a new vertex node.
                                // The peerconnection will still be closed on vertex node removal.
                                close_pc: false
                            }
                        };
                        console.debug("[WebRTC] Joining as subscriber...", {
                            message,
                            handle
                        });
                        let response = yield this.sendJanusPluginRequest(session, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Joined as subscriber", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            videoRoomSwitch(session, handle, publisherId) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        if (handle == 0) throw new Error("invalid handle");
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "switch",
                                feed: publisherId
                            }
                        };
                        console.debug("[WebRTC] Switching subscription...", {
                            message,
                            handle
                        });
                        let response = yield this.sendJanusPluginRequest(session, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Switched Subscription", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            videoRoomConfigureRestart(session, handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        if (handle == 0) throw new Error("invalid handle");
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "configure",
                                restart: true
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(session, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Sent Configure Restart request", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            startSubscribe(session, handle, type, content) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        if (type != "offer" && type != "answer") throw new Error("unsupported sdp type");
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "start"
                            },
                            jsep: {
                                type: type,
                                sdp: content
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(session, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Started subscriber feed", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            sendTrickleIce(jsession, handle, sdpMid, sdpMlineIndex, content) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        let message = {
                            janus: "trickle",
                            transaction: generateTransaction(),
                            candidate: {
                                sdpMid: sdpMid,
                                sdpMLineIndex: sdpMlineIndex,
                                candidate: content
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] Sent ICE", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            sendTrickleIceCompleted(jsession, handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        let message = {
                            janus: "trickle",
                            transaction: generateTransaction(),
                            candidate: {
                                completed: true
                            }
                        };
                        let response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        console.log("[WebRTC] ICE Completed", response.body);
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            publishToVideoRoom(jsession, handle, audio, video, type, content) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        if (type != "offer" && type != "answer") throw new Error("sdp type unsupported");
                        let jsep = {
                            type: type,
                            sdp: content
                        };
                        let message = {
                            janus: "message",
                            transaction: generateTransaction(),
                            body: {
                                request: "configure",
                                audio: !!audio,
                                video: !!video
                            },
                            jsep: jsep
                        };
                        let response = yield this.sendJanusPluginRequest(jsession, handle, message);
                        assertSuccess(response);
                        console.debug("[WebRTC] publish request made", {
                            request: message,
                            response: response.body
                        });
                        return {};
                    } catch (e) {
                        return {
                            error: e
                        };
                    }
                });
            }
            sendJanusSessionRequest(jsession, message) {
                let url = `${this.janusBase}janus/${jsession}`;
                return this.sendJanusRequestPost(url, message);
            }
            sendJanusPluginRequest(jsession, handle, message) {
                let url = `${this.janusBase}janus/${jsession}/${handle}`;
                return this.sendJanusRequestPost(url, message);
            }
            sendJanusRequestPost(uri, message) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (!message.janus) throw new Error(`The 'janus' property is not set in message`);
                    let init = this.prepareInit("post");
                    init.body = JSON.stringify(message);
                    let resp = yield fetch(uri, init);
                    let body = yield resp.json();
                    return {
                        statusCode: resp.status,
                        body: body
                    };
                });
            }
            sendJanusRequestGet(uri) {
                return __awaiter(this, void 0, void 0, function*() {
                    let init = this.prepareInit("get");
                    let resp = yield fetch(uri, init);
                    let body = yield resp.json();
                    return {
                        statusCode: resp.status,
                        body: body
                    };
                });
            }
        }
        NodeComponentModel.JanusApi = JanusApi;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let WebRtc;
    (function(WebRtc) {
        class WebRtcStatTracker {
            constructor(){
                this.displaySensitiveInfo = false;
                this.displayAllRtcStats = false;
                this.peerConnectionMonitors = new Map();
                this.scopes = new Map();
            }
            getJsonSnapshot() {
                return JSON.stringify(this.scopes, this.jsonMapReplacer.bind(this), 2);
            }
            downloadJsonSnapshot() {
                let blob = new Blob([
                    this.getJsonSnapshot()
                ], {
                    type: "application/json"
                });
                let fileUrl = URL.createObjectURL(blob);
                let now = new Date();
                let dateStr = now.toISOString().replace(".", "_").replace("/", "_");
                let anchor = document.createElement("a");
                anchor.href = fileUrl;
                anchor.download = `webrtc_stats_${dateStr}.json`;
                anchor.setAttribute("href", fileUrl);
                anchor.click();
            }
            jsonMapReplacer(key, value) {
                if (value instanceof Map) return this.objectFromEntries(value);
                return value;
            }
            objectFromEntries(entries) {
                if (!entries || !entries[Symbol.iterator]) throw new Error("Object.fromEntries() requires a single iterable argument");
                let obj = {};
                for (let [key, value] of entries)obj[key] = value;
                return obj;
            }
            set(scopeName, statName, value, sensitive = false) {
                // create scope if needed
                let scope = this.scopes.get(scopeName);
                if (!scope) {
                    scope = {
                        stats: new Map(),
                        visible: displayByDefault(scopeName)
                    };
                    this.scopes.set(scopeName, scope);
                }
                // update the value
                // we might need to split this down into an object
                let parts = statName.split(".");
                if (parts.length == 2) {
                    // splitting logic
                    let rootObj = scope.stats.get(parts[0]);
                    if (!rootObj) rootObj = {
                        value: {},
                        sensitive: false,
                        timestamp: new Date()
                    };
                    // now based on the split, set the value downwards.
                    // todo: recursive?
                    if (!rootObj.value[parts[1]]) rootObj.value[parts[1]] = {};
                    rootObj.value[parts[1]] = value;
                    rootObj.timestamp = new Date();
                    scope.stats.set(parts[0], rootObj);
                }
                // no dots - put it straight in
                if (parts.length === 1) scope.stats.set(statName, {
                    value,
                    sensitive: !!sensitive,
                    timestamp: new Date()
                });
                this.pendingRefresh = true;
            }
            increment(scopeName, stat, amount = 1) {
                let scope = this.scopes.get(scopeName);
                if (!scope) {
                    scope = {
                        stats: new Map(),
                        visible: displayByDefault(scopeName)
                    };
                    this.scopes.set(scopeName, scope);
                }
                // increment the value
                let current = scope.stats.get(stat);
                if (!current) {
                    this.set(scopeName, stat, 0);
                    current = scope.stats.get(stat);
                }
                current.value = +current.value + amount;
                current.timestamp = new Date();
                this.pendingRefresh = true;
            }
            trackPeerConnection(scopeName, stat, peerConnection) {
                this.set(scopeName, stat, {
                    pending: true
                }, false);
                let interval = setInterval(()=>__awaiter(this, void 0, void 0, function*() {
                        let stats = yield peerConnection.getStats();
                        // reorganise the stats by type, because it's more useful
                        const sortedStats = new Map();
                        const boringStats = [
                            "certificate",
                            "codec",
                            //'local-candidate',
                            //'remote-candidate',
                            "track",
                            "stream",
                            "peer-connection", 
                        ];
                        stats.forEach((val)=>{
                            // each rtc stat has a 'type' and 'id' field.
                            // we re-sort it by type.
                            // also, just drop any irrelevant stats
                            if (boringStats.indexOf(val.type) > -1) return;
                            let arr = sortedStats.get(val.type);
                            if (!arr) {
                                arr = [];
                                sortedStats.set(val.type, arr);
                            }
                            arr.push(val);
                        });
                        this.set(scopeName, "rtcStats", sortedStats);
                    }), 1000);
                this.peerConnectionMonitors.set(peerConnection, interval);
            }
            untrackPeerConnection(peerConnection) {
                let interval = this.peerConnectionMonitors.get(peerConnection);
                if (interval) clearInterval(interval);
            }
            getScopeVisible(scopeName) {
                let scope = this.scopes.get(scopeName);
                if (!scope) return false;
                return scope.visible;
            }
            setScopeVisible(scopeName, isVisible) {
                let scope = this.scopes.get(scopeName);
                if (!scope) return;
                scope.visible = !!isVisible;
                this.pendingRefresh = true;
            }
            setWindowVisible(isVisible) {
                if (isVisible) {
                    // create stats window if needed
                    if (!this.statsWindowElement) this.statsWindowElement = this.createStatsWindowElement();
                    // inject styles if needed
                    if (!document.querySelector(".vertex-webrtc-styles")) {
                        let styles = WebRtc.createStatsCss();
                        document.head.appendChild(styles);
                    }
                    // ensure it's visible and such
                    document.documentElement.appendChild(this.statsWindowElement);
                    // start refresh handlers
                    this.refreshIntervalHandle = setInterval(()=>{
                        if (this.pendingRefresh) this.refreshStatsDisplay();
                    }, 16);
                    this.periodicRefreshHandle = setInterval(()=>{
                        this.pendingRefresh = true;
                    }, 1000);
                } else {
                    clearInterval(this.refreshIntervalHandle);
                    clearInterval(this.periodicRefreshHandle);
                    if (this.statsWindowElement) {
                        this.statsWindowElement.remove();
                        this.statsWindowElement = undefined;
                    }
                }
            }
            createStatsWindowElement() {
                let root = document.createElement("div");
                root.classList.add("vertex-webrtc-stats-window");
                {
                    let heading = document.createElement("div");
                    heading.classList.add("vertex-webrtc-stats-window-header");
                    heading.innerText = "WebRTC Stats";
                    {
                        let check = document.createElement("input");
                        check.type = "checkbox";
                        check.title = "Reveal Sensitive Info";
                        check.checked = false;
                        check.addEventListener("change", ()=>{
                            this.displaySensitiveInfo = check.checked;
                            this.pendingRefresh = true;
                        });
                        let checkLabel = document.createElement("label");
                        checkLabel.appendChild(check);
                        checkLabel.appendChild(document.createTextNode("Show Sensitive Info"));
                        checkLabel.style.cssFloat = "right";
                        heading.appendChild(checkLabel);
                    }
                    {
                        let check1 = document.createElement("input");
                        check1.type = "checkbox";
                        check1.title = "Show All RTC Info";
                        check1.checked = false;
                        check1.addEventListener("change", ()=>{
                            this.displayAllRtcStats = check1.checked;
                            this.pendingRefresh = true;
                        });
                        let checkLabel1 = document.createElement("label");
                        checkLabel1.appendChild(check1);
                        checkLabel1.appendChild(document.createTextNode("Show All RTC Info"));
                        checkLabel1.style.cssFloat = "right";
                        heading.appendChild(checkLabel1);
                    }
                    {
                        let saveBtn = document.createElement("button");
                        saveBtn.type = "button";
                        saveBtn.style.cssFloat = "right";
                        saveBtn.innerText = "Save";
                        saveBtn.addEventListener("click", ()=>{
                            this.downloadJsonSnapshot();
                        });
                        heading.appendChild(saveBtn);
                    }
                    root.appendChild(heading);
                }
                {
                    let body = document.createElement("div");
                    body.classList.add("vertex-webrtc-stats-window-body");
                    body.innerHTML = `<em>There are no stats.</em>`;
                    root.appendChild(body);
                }
                return root;
            }
            refreshStatsDisplay() {
                if (!this.statsWindowElement) return;
                this.pendingRefresh = false;
                let windowBody = this.statsWindowElement.querySelector(".vertex-webrtc-stats-window-body");
                // clear window and draw again.
                // !! slow!
                while(windowBody.firstChild)windowBody.removeChild(windowBody.firstChild);
                for (let [scope, { stats , visible  }] of this.scopes.entries()){
                    let scopeContainer = document.createElement("div");
                    scopeContainer.classList.add("vertex-webrtc-stats-scope");
                    scopeContainer.dataset["webrtcStatScope"] = scope;
                    let table = document.createElement("table");
                    table.style.verticalAlign = "top";
                    table.style.textAlign = "left";
                    table.style.width = "100%";
                    table.dataset["scopeName"] = scope;
                    {
                        let thead = document.createElement("thead");
                        thead.classList.add("vertex-webrtc-toggle", "vertex-webrtc-toggle-inactive");
                        thead.addEventListener("click", this.toggleBody.bind(this));
                        table.appendChild(thead);
                        let headRow = document.createElement("tr");
                        let th = document.createElement("th");
                        th.innerText = scope;
                        th.colSpan = 2;
                        headRow.appendChild(th);
                        thead.appendChild(headRow);
                    }
                    if (visible) {
                        let tbody = document.createElement("tbody");
                        table.appendChild(tbody);
                        for (let [stat, val] of stats.entries()){
                            if (stat === "rtcStats" && !this.displayAllRtcStats) continue;
                            let tr = document.createElement("tr");
                            let statcell = document.createElement("th");
                            statcell.style.verticalAlign = "top";
                            let valcell = document.createElement("td");
                            statcell.innerText = stat;
                            let isSensitive = val.sensitive && !this.displaySensitiveInfo;
                            let [formattedValue, formattedTooltip] = formatVal(val.value, isSensitive);
                            valcell.appendChild(formattedValue);
                            valcell.title = formattedTooltip;
                            tr.appendChild(statcell);
                            tr.appendChild(valcell);
                            tbody.appendChild(tr);
                        }
                    }
                    scopeContainer.appendChild(table);
                    windowBody.appendChild(scopeContainer);
                }
            }
            toggleBody(event) {
                let target = event.currentTarget;
                let table = target.parentElement;
                let scope = table.dataset["scopeName"];
                let current = this.getScopeVisible(scope);
                this.setScopeVisible(scope, !current);
            }
        }
        WebRtc.WebRtcStatTracker = WebRtcStatTracker;
        function createStatsCss() {
            // this is horrific but it means we don't have to rely on shipping and loading a stylesheet in client apps
            let styles = document.createElement("style");
            styles.classList.add("vertex-webrtc-styles");
            styles.innerHTML = `
.vertex-webrtc-stats-window {
    color: black;
    font-size: 0.8rem;
    position: absolute;
    top: 0;
    right: 0;
    min-width: 450px;
    min-height: 200px;
    border: 1px solid rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.666);
    padding: 0.333rem;
    margin: 1rem 2rem;
    border-radius: 2px;
    z-index: 1000;
}

.vertex-webrtc-stats-window-header {
    /*cursor: move;*/
    border: 1px solid rgba(255, 255, 255, 0.75);
    background: rgba(255, 255, 255, 0.5);
    padding: 0.333rem;
    margin: -0.333rem -0.333rem 0.333rem;
}

.vertex-webrtc-stats-window-body {
}
.vertex-webrtc-stats-scope {
    border-bottom: 1px solid black;
}
.vertex-webrtc-dimmed {
    opacity: 50%;
}

.vertex-webrtc-toggle {
    cursor: pointer;
}

.vertex-webrtc-toggle:hover {
    text-decoration: underline;
}
`;
            return styles;
        }
        WebRtc.createStatsCss = createStatsCss;
        function displayByDefault(scopeName) {
            if (scopeName.startsWith("vrh")) return true;
            if (scopeName.startsWith("observer")) return true;
            if (scopeName.startsWith("Controller")) return true;
            return false;
        }
        function formatVal(val, isSensitiveValue) {
            if (Array.isArray(val)) return arrayFormatter(val);
            if (val instanceof Date) return dateValueFormatter(val);
            if (val instanceof Map) return mapFormatter(val);
            if (isRtcStatObject(val)) return rtcStatFormatter(val);
            // place other specialized formatters above this one.
            if (typeof val === "object") return objectFormatter(val);
            // by now, this should be a trivial value - string cast it
            return stringFormatter(val, isSensitiveValue);
        }
        function stringFormatter(val, isSensitive) {
            let valStr = typeof val !== "undefined" ? val.toString() : "undefined";
            if (isSensitive) {
                let parent = document.createElement("span");
                let hiddenHint = document.createElement("em");
                hiddenHint.classList.add("vertex-webrtc-dimmed");
                hiddenHint.innerText = "(Hidden)";
                parent.appendChild(hiddenHint);
                let obscuredValue = document.createTextNode(valStr.substr(-4));
                parent.appendChild(obscuredValue);
                return [
                    parent
                ];
            } else {
                let tn = document.createTextNode(valStr);
                return [
                    tn
                ];
            }
        }
        function dateValueFormatter(val) {
            let now = new Date().getTime();
            let then = val.getTime();
            let delta = now - then;
            let seconds = delta / 1000;
            let tn = document.createTextNode(`${seconds}s ago`);
            return [
                tn,
                val.toString()
            ];
        }
        function mapFormatter(map) {
            // format this as a mini table inside
            let table = document.createElement("table");
            table.style.verticalAlign = "top";
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            for (let [key, val] of map.entries()){
                // heading
                let hrow = document.createElement("tr");
                let th = document.createElement("th");
                th.innerText = key;
                th.style.verticalAlign = "top";
                hrow.appendChild(th);
                tbody.appendChild(hrow);
                // content cell
                let [content, title] = formatVal(val, false);
                let brow = document.createElement("tr");
                let td = document.createElement("td");
                td.appendChild(content);
                td.title = title;
                brow.appendChild(td);
                tbody.appendChild(brow);
            }
            return [
                table
            ];
        }
        function arrayFormatter(arr) {
            // format this as a mini table inside
            let table = document.createElement("table");
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            for (let val of arr){
                let [content, title] = formatVal(val, false);
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.appendChild(content);
                td.title = title;
                tr.appendChild(td);
                tbody.appendChild(tr);
            }
            return [
                table
            ];
        }
        function objectFormatter(val) {
            // format this as a mini table inside
            let table = document.createElement("table");
            table.style.verticalAlign = "top";
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            for (let key of Object.getOwnPropertyNames(val)){
                let row = document.createElement("tr");
                // key/heading
                let th = document.createElement("th");
                th.innerText = key;
                th.style.verticalAlign = "top";
                row.appendChild(th);
                // value/content
                let item = val[key];
                let td = document.createElement("td");
                let [content, title] = formatVal(item, false);
                td.appendChild(content);
                td.title = title;
                row.appendChild(td);
                tbody.appendChild(row);
            }
            return [
                table
            ];
        }
        const rtcStatAllIgnoredValues = [
            "type",
            "timestamp"
        ];
        const rtcStatIgnoredValues = {
            "media-source": [
                "trackIdentifier",
                "audioLevel",
                "totalAudioEnergy",
                "echoReturnLossEnhancement",
                "echoReturnLoss",
                "totalSamplesDuration", 
            ],
            "candidate-pair": [
                "localCandidateId",
                "remoteCandidateId",
                "priority",
                "transportId"
            ],
            "inbound-rtp": [
                ""
            ],
            "outbound-rtp": [
                "trackId",
                "codecId",
                "remoteSourceId",
                "remoteId",
                "transportId",
                "mediaSourceId",
                "firCount",
                "pliCount",
                "kind",
                "framesEncoded",
                "keyFramesEncoded",
                "totalEncodeTime",
                "totalEncodedBytesTarget",
                "qpSum"
            ],
            "transport": [
                "localCertificateId",
                "remoteCertificateId",
                "tlsVersion",
                "dtlsCipher",
                "srtpCipher",
                "selectedCandidatePairChanges"
            ]
        };
        const rtcStatFilters = {
            "candidate-pair": (val)=>{
                if (val.state === "waiting") return false;
                if (val.state === "in-progress") return false;
                return true;
            }
        };
        function rtcStatFormatter(val) {
            // format this as a mini table inside
            let table = document.createElement("table");
            table.style.verticalAlign = "top";
            let tbody = document.createElement("tbody");
            table.appendChild(tbody);
            // apply filters to bypass some stats
            let filterFunc = rtcStatFilters[val.type];
            if (filterFunc) {
                if (!filterFunc(val)) return [
                    table
                ];
            }
            for (let key of Object.getOwnPropertyNames(val)){
                // skip boring keys
                if (rtcStatAllIgnoredValues.indexOf(key) > -1) continue;
                if (Array.isArray(rtcStatIgnoredValues[val.type])) {
                    if (rtcStatIgnoredValues[val.type].indexOf(key) > -1) continue;
                }
                let row = document.createElement("tr");
                // key/heading
                let th = document.createElement("th");
                th.innerText = key;
                th.style.verticalAlign = "top";
                row.appendChild(th);
                // value/content
                let item = val[key];
                let td = document.createElement("td");
                let [content, title] = formatVal(item, false);
                td.appendChild(content);
                td.title = title;
                row.appendChild(td);
                tbody.appendChild(row);
            }
            return [
                table
            ];
        }
        function isRtcStatObject(val) {
            if (typeof val !== "object") return false;
            if ("id" in val && typeof val["id"] === "string" && val["id"].startsWith("RTC")) return true;
            return false;
        }
    })(WebRtc = Vertex.WebRtc || (Vertex.WebRtc = {}));
})(Vertex || (Vertex = {}));
/// <reference path="janusapi.ts"/>
/// <reference path="webrtcstats.ts"/>
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        /** internally used as part of webrtc - this has some caveats and bugs and should not be used outside of webrtc. */ class _WebRTCEvent {
            constructor(){
                this.handlers = new Map();
            }
            add(handler, context) {
                if (typeof handler === "function") this.handlers.set(handler, context);
                else throw new Error("handler must be a function");
            }
            remove(handler) {
                this.handlers.delete(handler);
            }
            invoke(sender, e) {
                this.handlers.forEach((thisArg, fn)=>{
                    if (thisArg) fn.call(thisArg, sender, e);
                    else fn(sender, e);
                });
            }
        }
        NodeComponentModel._WebRTCEvent = _WebRTCEvent;
        function delay(timeoutMs) {
            return new Promise((resolve)=>{
                setTimeout(resolve, timeoutMs);
            });
        }
        class JanusSessionObserver {
            constructor(janus, statTracker){
                this.janus = janus;
                this.cts = new CancellationTokenSource();
                this.stats = statTracker;
                this.onError = new _WebRTCEvent();
                this.onKeepAlive = new _WebRTCEvent();
                this.onEvent = new _WebRTCEvent();
                this.onVideoRoomEvent = new _WebRTCEvent();
                this.onWebRtcUp = new _WebRTCEvent();
                this.onWebRtcMedia = new _WebRTCEvent();
                this.onWebRtcSlowLink = new _WebRTCEvent();
                this.onWebRtcHangup = new _WebRTCEvent();
                this.onEvent.add(this.self_onEvent, this);
            }
            observeSession(sessionId, spaceId, viewpointId) {
                if (this.observing) throw new Error("already observing");
                this.spaceId = spaceId;
                this.viewpointId = viewpointId;
                this.sessionId = sessionId;
                this.observing = true;
                // todo: cancellation
                // note: not awaited on purpose
                this.stats.set("observer", "keepAlive.sentAt", "Never");
                this.stats.set("observer", "keepAlive.sendRtt", -1);
                this.stats.set("observer", "keepAlive.receivedAt", "Never");
                this.stats.set("observer", "lastMessage.time", "Never");
                this.stats.set("observer", "lastMessage.type", "none");
                this.beginObserveSessionAndKeepAliveAsync();
            }
            destroy() {
                this.cts.cancel();
            }
            beginObserveSessionAndKeepAliveAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    // todo: cancellation
                    try {
                        while(!this.cts.isCancellationRequested)try {
                            var response = yield this.janus.getSessionInfoAsync(this.sessionId);
                            if (response.error != null) throw response.error;
                            this.cts.throwIfCancelled();
                            var root = response.responseBody;
                            if (!root) throw new Error("No response for session info, the session has probably closed.");
                            this.stats.set("observer", "lastMessage.time", new Date());
                            this.stats.set("observer", "lastMessage.type", root.janus);
                            // handle response and fire events
                            var evt = root.janus;
                            switch(evt){
                                case "keepalive":
                                    try {
                                        this.stats.set("observer", "keepAlive.receivedAt", new Date());
                                        this.onKeepAlive.invoke(this, root);
                                    } catch (e) {
                                        console.error(`[WebRTC] Unhandled Error while firing OnKeepAlive for session ${this.sessionId}:`, e);
                                    }
                                    break;
                                case "event":
                                    try {
                                        this.onEvent.invoke(this, root);
                                    } catch (e1) {
                                        console.error(`[WebRTC] Unhandled Error while firing OnEvent for session ${this.sessionId}`, e1);
                                    }
                                    break;
                                case "webrtcup":
                                    try {
                                        this.onWebRtcUp.invoke(this, root);
                                    } catch (e2) {
                                        console.error(`[WebRTC] Unhandled error while firing OnWebRtcUp for session ${this.sessionId}`, e2);
                                    }
                                    break;
                                case "hangup":
                                    try {
                                        this.onWebRtcHangup.invoke(this, root);
                                    } catch (e3) {
                                        console.error(`[WebRTC] Unhandled error while firing OnWebRtcHangup for session ${this.sessionId}`, e3);
                                    }
                                    break;
                                case "media":
                                    try {
                                        this.onWebRtcMedia.invoke(this, root);
                                    } catch (e4) {
                                        console.error(`[WebRTC] Unhandled error while firing OnWebRtcMedia for session ${this.sessionId}`, e4);
                                    }
                                    break;
                                case "slowlink":
                                    try {
                                        this.onWebRtcSlowLink.invoke(this, root);
                                    } catch (e5) {
                                        console.error(`[WebRTC] Unhandled error while firing OnWebRtcSlowLink for session ${this.sessionId}`, e5);
                                    }
                                    break;
                                default:
                                    console.warn(`[WebRTC] Unknown Janus Event '${evt}' received from server for ${this.sessionId}`, root);
                                    break;
                            }
                        } catch (e6) {
                            this.stats.set("observer", "remoteError", new Date());
                            console.error(`[WebRTC] Unhandled Error while observing session ${this.sessionId}:`, e6);
                            this.onError.invoke(this, e6);
                            return;
                        } finally{
                            try {
                                let startTime = new Date().getTime();
                                yield this.janus.sendVertexKeepAlive(this.spaceId, this.viewpointId, this.sessionId);
                                let endTime = new Date().getTime();
                                let delta = endTime - startTime;
                                this.stats.set("observer", "keepAlive.sendRtt", delta);
                                this.stats.set("observer", "keepAlive.sentAt", new Date());
                            } catch (e7) {
                                this.stats.set("observer", "keepAliveError", new Date());
                                console.error(`[WebRTC] Unhandled Error while sending KeepAlive for ${this.sessionId}: `, e7);
                                this.onError.invoke(this, e7);
                                return;
                            }
                        }
                    } finally{
                        this.stats.set("observer", "observerStopped", new Date());
                    }
                });
            }
            self_onEvent(sender, evt) {
                let plugin = evt.plugindata.plugin;
                switch(plugin){
                    case "janus.plugin.videoroom":
                        // todo: could reprocess this
                        this.onVideoRoomEvent.invoke(this, evt);
                        break;
                    default:
                        console.warn(`[WebRTC] Unknown plugin '${plugin}' received in event from server for ${this.sessionId}:`, evt);
                        break;
                }
            }
        }
        NodeComponentModel.JanusSessionObserver = JanusSessionObserver;
        class TaskCompletionSource {
            constructor(){
                this._completed = false;
                let self = this;
                this._promise = new Promise((a, b)=>{
                    self._resolver = a;
                    self._rejecter = b;
                });
            }
            trySetResult(value) {
                this._resolver(value);
                this._completed = true;
                return true;
            }
            trySetException(e) {
                this._rejecter(e);
                this._completed = true;
                return true;
            }
            trySetCancelled() {
                this._rejecter(new Error("Task was cancelled"));
                this._completed = true;
                return true;
            }
            get task() {
                return this._promise;
            }
            get isCompleted() {
                return this._completed;
            }
        }
        NodeComponentModel.TaskCompletionSource = TaskCompletionSource;
        class CancellationTokenSource {
            constructor(){
                this.callbacks = new Set();
                this._cancellationPromise = new Promise((resolver)=>{
                    this._cancellationResolver = resolver;
                });
                this._cancelled = false;
            }
            get isCancellationRequested() {
                return this._cancelled;
            }
            register(callback) {
                this.callbacks.add(callback);
            }
            cancel() {
                if (this._cancelled) return;
                this._cancelled = true;
                this._cancellationResolver();
                for (let cb of this.callbacks)cb(this);
            }
            throwIfCancelled() {
                if (this._cancelled) throw new Error(`The CancellationToken was cancelled`);
            }
            /** returns a promise which resolves when this token is cancelled */ promise() {
                return this._cancellationPromise;
            }
            static get none() {
                return this._noneInstance;
            }
            /**
             * returns the provided token, or 'none' if no token is given. useful for ensuring
             * a token is always valid even if one wasnt passed
             * @param source
             */ static ensure(source) {
                if (source && source instanceof CancellationTokenSource) return source;
                return this.none;
            }
        }
        CancellationTokenSource._noneInstance = new CancellationTokenSource();
        NodeComponentModel.CancellationTokenSource = CancellationTokenSource;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class DefaultWebRtcUserMediaFactory {
            constructor(){
                this.initialized = false;
            }
            initializeUserMediaAsync(args) {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        // todo: this has some real jammy control flow
                        try {
                            if (args.initAudio && args.initVideo) {
                                yield this._initAV();
                                console.debug("[VERTX:WebRtc:initializeUserMedia] Successfully initialized Video and Audio devices");
                            } else throw new Error("Not initing audio+video because only audio or video was requested");
                        } catch (err1) {
                            // couldnt get both, try audio only
                            try {
                                if (args.initAudio) {
                                    yield this._initA();
                                    console.debug("[VERTX:WebRtc:initializeUserMedia] Successfully initialized Audio devices");
                                } else throw new Error("Not initing audio because audio was not requested");
                            } catch (err2) {
                                try {
                                    if (args.initVideo) {
                                        yield this._initV();
                                        console.debug("[VERTX:WebRtc:initializeUserMedia] Successfully initialized Video devices");
                                    } else throw new Error("Not initing video because video was not requested");
                                } catch (err3) {
                                    console.debug("[VERTX:WebRtc:initializeUserMedia] Failed to initialize any media devices");
                                    throw {
                                        errors: [
                                            err1,
                                            err2,
                                            err3
                                        ]
                                    };
                                }
                            }
                        }
                    } catch (e) {
                        console.error("[VERTX:WebRtc:initializeUserMedia] Failed to initialize any media devices");
                        throw e;
                    } finally{
                        this.initialized = true;
                    }
                });
            }
            getCurrentMediaAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    if (!this.initialized) throw new Error("Must initialize before getting media");
                    if (!this.userMediaStream) return [];
                    let audio = this.userMediaStream.getAudioTracks() || [];
                    let video = this.userMediaStream.getVideoTracks() || [];
                    return audio.concat(video);
                });
            }
            releaseUserMediaAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.initialized = false;
                    // todo: maybe remove all the tracks?
                    this.userMediaStream.stop();
                    this.userMediaStream = null;
                });
            }
            // this is sort of obtuse but matches the previous implementation
            // this can be annoying because it spams up to 3 popups on some devices
            // if the user says 'no'.
            _initAV() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true
                    });
                });
            }
            _initA() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    });
                });
            }
            _initV() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: true
                    });
                });
            }
        }
        NodeComponentModel.DefaultWebRtcUserMediaFactory = DefaultWebRtcUserMediaFactory;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        class WebRtcComponentLifecycle {
        }
        NodeComponentModel.WebRtcComponentLifecycle = WebRtcComponentLifecycle;
        class BaseWebRtcComponentView extends WebRtcComponentLifecycle {
            constructor(){
                super(...arguments);
                this.__dummyView = null;
            }
        }
        NodeComponentModel.BaseWebRtcComponentView = BaseWebRtcComponentView;
        class BaseWebRtcComponentController extends WebRtcComponentLifecycle {
            constructor(){
                super(...arguments);
                this.__dummyController = null;
            }
        }
        NodeComponentModel.BaseWebRtcComponentController = BaseWebRtcComponentController;
        class WebRtcComponentSystem2Impl extends NodeComponentModel.ComponentSystemBase {
            constructor(system, componentName, view, controller){
                super(componentName, view, controller);
                this.system = system;
            }
            create() {
                return this.system.createComponent();
            }
        }
        NodeComponentModel.WebRtcComponentSystem2Impl = WebRtcComponentSystem2Impl;
        class WebRtcComponentView2Impl extends NodeComponentModel.ComponentViewBase {
            constructor(system, viewType){
                super();
                this.viewObjects = new Map();
                this.viewType = viewType;
                this.system = system;
            }
            addComponent(basecomponent, node) {
                let component = basecomponent;
                let viewInstance = new this.viewType();
                viewInstance.node = node;
                viewInstance.component = component;
                viewInstance.system = this.system;
                viewInstance.bindComponent(this.system, node, component);
                this.viewObjects.set(node.id, viewInstance);
            }
            removeComponent(basecomponent, node) {
                let component = basecomponent;
                let viewInstance = this.viewObjects.get(node.id);
                this.viewObjects.delete(node.id);
                if (viewInstance) viewInstance.unbindComponent(this.system, node, component);
            }
        }
        NodeComponentModel.WebRtcComponentView2Impl = WebRtcComponentView2Impl;
        class WebRtcComponentController2Impl extends NodeComponentModel.ComponentControllerBase {
            constructor(system, controllerType){
                super();
                this.controllerObjects = new Map();
                this.controllerType = controllerType;
                this.system = system;
            }
            addComponent(basecomponent, node) {
                let component = basecomponent;
                let controllerInstance = new this.controllerType();
                controllerInstance.node = node;
                controllerInstance.component = component;
                controllerInstance.system = this.system;
                controllerInstance.bindComponent(this.system, node, component);
                this.controllerObjects.set(node.id, controllerInstance);
            }
            removeComponent(basecomponent, node) {
                let component = basecomponent;
                let controllerInstance = this.controllerObjects.get(node.id);
                this.controllerObjects.delete(node.id);
                if (controllerInstance) controllerInstance.unbindComponent(this.system, node, component);
            }
        }
        NodeComponentModel.WebRtcComponentController2Impl = WebRtcComponentController2Impl;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        // Todo: None of these classes are currently exported.
        // We could re-export them to enable legacy WebRTC support (probably still needed in places)
        class DefaultWebRtcComponentSystem extends NodeComponentModel.ComponentSystemBase {
            /**
             * Constructs the DefaultWebRtcComponentSystem. This component system supports inheritance.
             * @param componentName The component name. Defaults to "WebRtc"
             * @param view The View. Defaults to a new DefaultWebRtcComponentView.
             * @param controller The Controller. Defaults to a new DefaultWebRtcComponentController.
             */ constructor(componentName, view, controller){
                componentName = componentName || "WebRtc";
                view = view instanceof NodeComponentModel.ComponentViewBase ? view : new DefaultWebRtcComponentView();
                controller = controller instanceof NodeComponentModel.ComponentControllerBase ? controller : new DefaultWebRtcComponentController();
                super(componentName, view, controller);
            }
            create() {
                return new NodeComponentModel.WebRtcComponent();
            }
        }
        NodeComponentModel.DefaultWebRtcComponentSystem = DefaultWebRtcComponentSystem;
        class DefaultWebRtcComponentView extends NodeComponentModel.ComponentViewBase {
            constructor(){
                super();
                DefaultWebRtcComponentView.injectAdapterJsSafe();
                this.remoteMediaStreams = new Map();
            }
            addComponent(baseComp, node) {
                return __awaiter(this, void 0, void 0, function*() {
                    let component = baseComp;
                    // Wait for WebRTC Init, and display a hint to the developer if they forgot to init.
                    DefaultWebRtcComponentView._hintIfWebRtcNotInitiailized("DefaultWebRtcComponentView:addComponent");
                    yield DefaultWebRtcComponentView.isInitializedAsync;
                    // If the view is not us, then we'll use VERTX to ask the sender to make an offer
                    if (node.HasToken == false) {
                        let context = `${component.sndContext}-${component.rcvContext}`;
                        let receiverConnection = yield component.createConnectionAsync(context, node.Space);
                        receiverConnection.peerConnection.addEventListener("track", (evt)=>this.peerConnection_onTrack.call(this, evt, receiverConnection, component, node));
                        receiverConnection.peerConnection.addEventListener("removetrack", (evt)=>this.peerConnection_onRemoveTrack.call(this, evt, receiverConnection, component, node));
                        receiverConnection.peerConnection.addEventListener("connectionstatechange", (evt)=>this.peerConnection_onConnectionStateChange.call(this, evt, receiverConnection, component, node));
                        let args = new NodeComponentModel.WebRtcOnConnectArgs();
                        args.rcvContext = component.rcvContext;
                        component.onConnect.fire(component, args);
                        let stream = this.remoteMediaStreams.get(context);
                        if (!stream) stream = this.createRemoteMediaStream(context, node);
                    }
                });
            }
            removeComponent(baseComp, node) {
                let component = baseComp;
                let connections = component.getConnections();
                for (let connection of connections)this.destroyRemoteMediaStream(connection.context, node);
                component.clearConnections();
            }
            createRemoteMediaStream(context, node) {
                if (this.remoteMediaStreams.has(context)) throw new Error(`[VERTX:DefaultWebRtcComponentView:createRemoteMediaStream] A media stream already exists for the context '${context}'`);
                let stream = new MediaStream();
                this.remoteMediaStreams.set(context, stream);
                let args = {
                    type: "created",
                    context: context,
                    stream: stream
                };
                node.event.fire("WebRtc:remotestreamchange", args);
                return stream;
            }
            destroyRemoteMediaStream(context, node) {
                let stream = this.remoteMediaStreams.get(context);
                if (stream) {
                    let tracks = stream.getTracks();
                    for (let track of tracks)stream.removeTrack(track);
                    this.remoteMediaStreams.delete(context);
                }
                let args = {
                    type: "destroyed",
                    context: context,
                    stream: stream || null
                };
                node.event.fire("WebRtc:remotestreamchange", args);
            }
            peerConnection_onTrack(event, connection, component, node) {
                return __awaiter(this, void 0, void 0, function*() {
                    let stream = this.remoteMediaStreams.get(connection.context);
                    stream.addTrack(event.track);
                    let args = {
                        type: "trackadded",
                        context: connection.context,
                        stream: stream,
                        track: event.track
                    };
                    node.event.fire("WebRtc:remotestreamchange", args);
                });
            }
            peerConnection_onRemoveTrack(event, connection, component, node) {
                let stream = this.remoteMediaStreams.get(connection.context);
                stream.removeTrack(event.track);
                let args = {
                    type: "trackremoved",
                    context: connection.context,
                    stream: stream,
                    track: event.track
                };
                node.event.fire("WebRtc:remotestreamchange", args);
            }
            peerConnection_onConnectionStateChange(event, connection, component, node) {
                let peerConnection = connection.peerConnection;
                if (peerConnection.connectionState === "disconnected") this.destroyRemoteMediaStream(connection.context, node);
            }
            /**
            * Initializes WebRTC.
            * WebRTC components will not send or receive any data until this method is invoked globally.
            * This method is safe to be called multiple times.
            *
            * It is strongly recommended to invoke this method as a result of user-interaction (e.g. a user click)
            * to allow autoplay to work correctly.
            * */ static initializeWebRtc(init) {
                let config = {
                    mp3NoiseUrl: "/static/images/noise.mp3",
                    oggNoiseUrl: "/static/images/noise.ogg"
                };
                Object.assign(config, init);
                this.initNoiseElement(config);
                DefaultWebRtcComponentView._initializeResolver();
                DefaultWebRtcComponentView._isInitialized = true;
            }
            static uninitializeWebRtc() {
                DefaultWebRtcComponentView._isInitialized = false;
                DefaultWebRtcComponentView.isInitializedAsync = new Promise((_res)=>{
                    DefaultWebRtcComponentView._initializeResolver = _res;
                });
                if (DefaultWebRtcComponentView._noiseElement) {
                    DefaultWebRtcComponentView._noiseElement.parentNode.removeChild(DefaultWebRtcComponentView._noiseElement);
                    DefaultWebRtcComponentView._noiseElement = null;
                }
                if (this.userMediaStream && typeof this.userMediaStream.stop === "function") this.userMediaStream.stop();
                this.userMediaStream = null;
                this.audioTracks = null;
                this.videoTracks = null;
            }
            static getLocalMediaTracks() {
                let audio = DefaultWebRtcComponentView.audioTracks || [];
                let video = DefaultWebRtcComponentView.videoTracks || [];
                return audio.concat(video);
            }
            static initializeLocalMediaDevicesAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    if (DefaultWebRtcComponentView.userMediaStream instanceof MediaStream) return;
                    // todo: the userMediaStream fails unless *all* constraints are satisfied???
                    try {
                        // If neither video or audio devices are available, the stream succeeds but with no devices.
                        // If we ask for video+audio, but the user had *just* a one or the other, then the 
                        // getUserMedia promise fails.
                        // So, if this promise fails, we ask for audio and video seperately to get the one that is available.
                        try {
                            yield this.initializeAudioVideoDevicesAsync();
                            console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Successfully initialized Video and Audio devices");
                        } catch (err) {
                            // we couldn't get both
                            // try to get audio
                            try {
                                console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Could not initialize Video+Audio, trying Audio Only...", err);
                                yield this.initializeAudioDevicesAsync();
                                console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Successfully initialized Audio device");
                            } catch (err2) {
                                // try to get video
                                try {
                                    console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Could not initialize Video+Audio or Audio, trying Video Only...", err2);
                                    yield this.initializeVideoDevicesAsync();
                                    console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Successfully initialized Video device");
                                } catch (err3) {
                                    console.debug("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Could not initialize Video+Audio, Audio or Video. Failed device initialization.", err2);
                                    throw {
                                        errors: [
                                            err,
                                            err2,
                                            err3
                                        ]
                                    };
                                }
                            }
                        }
                    } catch (e) {
                        console.error("[VERTX:DefaultWebRtcComponentView:initializeMediaDevicesAsync] Failed to initialize media devices", e);
                        throw e;
                    }
                });
            }
            static initializeAudioVideoDevicesAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    DefaultWebRtcComponentView.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true
                    });
                    DefaultWebRtcComponentView.audioTracks = yield DefaultWebRtcComponentView.userMediaStream.getAudioTracks();
                    DefaultWebRtcComponentView.videoTracks = yield DefaultWebRtcComponentView.userMediaStream.getVideoTracks();
                });
            }
            static initializeVideoDevicesAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    DefaultWebRtcComponentView.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: true
                    });
                    DefaultWebRtcComponentView.audioTracks = [];
                    DefaultWebRtcComponentView.videoTracks = yield DefaultWebRtcComponentView.userMediaStream.getVideoTracks();
                });
            }
            static initializeAudioDevicesAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    DefaultWebRtcComponentView.userMediaStream = yield navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    });
                    DefaultWebRtcComponentView.audioTracks = yield DefaultWebRtcComponentView.userMediaStream.getAudioTracks();
                    DefaultWebRtcComponentView.videoTracks = [];
                });
            }
            static _fireLocalMediaEvent(node) {
                if (DefaultWebRtcComponentView.userMediaStream) {
                    let tracks = this.getLocalMediaTracks();
                    let args = {
                        type: "available",
                        stream: DefaultWebRtcComponentView.userMediaStream,
                        tracks: tracks
                    };
                    node.event.fire("WebRtc:localmediachange", args);
                } else {
                    let args1 = {
                        type: "unavailable",
                        stream: null,
                        tracks: []
                    };
                    node.event.fire("WebRtc:localmediachange", args1);
                }
            }
            static disposeMediaDevicesAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    try {
                        // If an existing media stream exists, clean it up
                        if (DefaultWebRtcComponentView.userMediaStream) {
                            let tracks = DefaultWebRtcComponentView.userMediaStream.getTracks();
                            for (let track of tracks)track.stop();
                            DefaultWebRtcComponentView.userMediaStream.stop();
                            DefaultWebRtcComponentView.userMediaStream = null;
                        }
                        // same for the tracks (we should have covered this already)
                        if (DefaultWebRtcComponentView.audioTracks) {
                            for (let track1 of DefaultWebRtcComponentView.audioTracks)track1.stop();
                            DefaultWebRtcComponentView.audioTracks = null;
                        }
                        if (DefaultWebRtcComponentView.videoTracks) {
                            for (let track2 of DefaultWebRtcComponentView.videoTracks)track2.stop();
                            DefaultWebRtcComponentView.videoTracks = null;
                        }
                    } catch (e) {
                        console.error("Failed to clean up old media devices", e);
                    }
                });
            }
            static initNoiseElement(config) {
                // Create an element to play some background noise.
                // This not only assures the user that a call is active, but helps autoplay run reliably.
                if (!DefaultWebRtcComponentView._noiseElement) {
                    let audio = document.createElement("audio");
                    audio.id = "vertexDefaultWebRtcComponent_noiseElement";
                    audio.style.display = "none";
                    audio.autoplay = true;
                    audio.loop = true;
                    audio.controls = false;
                    // todo: check if playsinline is uppercase or not. (Safari-only attribute)
                    audio["playsinline"] = true;
                    document.body.appendChild(audio);
                    DefaultWebRtcComponentView._noiseElement = audio;
                }
                // Clear any existing sources and add new
                for (let child of DefaultWebRtcComponentView._noiseElement.childNodes)child.parentNode.removeChild(child);
                let mp3src = document.createElement("source");
                mp3src.src = config.mp3NoiseUrl;
                let oggsrc = document.createElement("source");
                oggsrc.src = config.oggNoiseUrl;
                DefaultWebRtcComponentView._noiseElement.appendChild(mp3src);
                DefaultWebRtcComponentView._noiseElement.appendChild(oggsrc);
                // Attempt to play the noise element.
                // If it fails, then warn the dev that autoplay wont work.
                let playPromise = DefaultWebRtcComponentView._noiseElement.play();
                if (playPromise instanceof Promise) {
                    let errMsg = "[VERTX:DefaultWebRtcComponentView:initializeWebRtc] The WebRTC Background Noise could not be autoplayed.\nTry calling initializeWebRtc again as a result of direct user interaction (e.g. a mouse click).\nSome WebRTC elements may fail to autoplay without user interaction.";
                    try {
                        playPromise.then((_)=>{
                            // autoplay succeeded
                            console.log("[VERTX:WebRtcComponentSystem:initializeWebRtc] Successfully started playing the WebRTC Background Noise. Autoplays should succeed reliably.");
                        }).catch((err)=>{
                            // autoplay failed
                            console.error(errMsg, err);
                        });
                    } catch (err2) {
                        // catch in case we are in a browser that doesn't support Promise.catch
                        console.error(errMsg, err2);
                    }
                }
            }
            static injectAdapterJsSafe() {
                // adapter improves the compatibility of WebRTC across browsers
                if (!window["adapter"]) {
                    let ele = document.createElement("script");
                    // todo: host on VERTX
                    ele.src = "https://unpkg.com/webrtc-adapter@7.7.0/out/adapter.js";
                    document.body.appendChild(ele);
                }
            }
            static _hintIfWebRtcNotInitiailized(context) {
                return __awaiter(this, void 0, void 0, function*() {
                    let timeout = new Promise((resolve)=>{
                        window.setTimeout(resolve, 1000, "timeout");
                    });
                    let winner = yield Promise.race([
                        timeout,
                        DefaultWebRtcComponentView.isInitializedAsync
                    ]);
                    if (winner === "timeout") console.warn(`[VERTX:${context}] HINT: Waiting for WebRtcComponentView to be initialized.\n` + "You must call the static 'WebRtcComponentView.initializeWebRtc()' method before incoming or outgoing WebRTC connections can be made.\n\n" + "The pending WebRTC call will continue once initialize has been called.");
                });
            }
        }
        DefaultWebRtcComponentView.userMediaStream = null;
        DefaultWebRtcComponentView.audioTracks = null;
        DefaultWebRtcComponentView.videoTracks = null;
        DefaultWebRtcComponentView._noiseElement = null;
        // Implementation Note: _initializeResolver must be declared above 'isInitializedAsync'
        DefaultWebRtcComponentView._initializeResolver = null;
        DefaultWebRtcComponentView._isInitialized = false;
        DefaultWebRtcComponentView.isInitializedAsync = new Promise((_res)=>{
            DefaultWebRtcComponentView._initializeResolver = _res;
        });
        NodeComponentModel.DefaultWebRtcComponentView = DefaultWebRtcComponentView;
        class DefaultWebRtcComponentController extends NodeComponentModel.ComponentControllerBase {
            constructor(){
                super(...arguments);
                this.componentChangedHandlers = new Map();
            }
            addComponent(baseComp, node) {
                return __awaiter(this, void 0, void 0, function*() {
                    let component = baseComp;
                    let changeHandler = this.component_changed.bind(this);
                    this.componentChangedHandlers.set(baseComp, changeHandler);
                    component.onChanged.on(changeHandler);
                    // Ensure WebRTC initialize has been called.
                    // We run this timeout race to display a hint to the developer if they forget to initialize...
                    DefaultWebRtcComponentView._hintIfWebRtcNotInitiailized("DefaultWebRtcComponentController:addComponent");
                    // Initialize the local user's media devices.
                    // We do this now so that the user sees the prompt for Audio/Video at the expected time.
                    // This is NOT awaited on purpose - we just kick it off
                    let mediaPromise = DefaultWebRtcComponentView.initializeLocalMediaDevicesAsync();
                    // We're now ready to handle requests for calls
                    component.onConnect.on((args)=>this.component_onConnect.call(this, args, component, node, mediaPromise));
                    // Now wait here for init...
                    yield DefaultWebRtcComponentView.isInitializedAsync;
                    // Send local media availability event when the promise is sorted
                    mediaPromise.then(()=>{
                        DefaultWebRtcComponentView._fireLocalMediaEvent(node);
                    }).catch(()=>{
                        DefaultWebRtcComponentView._fireLocalMediaEvent(node);
                    });
                });
            }
            removeComponent(baseComp, node) {
                let component = baseComp;
                if (this.componentChangedHandlers.has(baseComp)) {
                    let handler = this.componentChangedHandlers.get(baseComp);
                    this.componentChangedHandlers.delete(baseComp);
                    component.onChanged.off(handler);
                }
                // If we remove the one we're controlling, we'll un-initialize WebRTC again
                if (node.HasToken === true) {
                    DefaultWebRtcComponentView.uninitializeWebRtc();
                    DefaultWebRtcComponentView._fireLocalMediaEvent(node);
                }
            }
            component_changed(baseComp) {
                let component = baseComp;
                this.setTracksEnabled(component);
            }
            setTracksEnabled(component) {
                let audioTracks = DefaultWebRtcComponentView.audioTracks || [];
                for (var track of audioTracks)track.enabled = component.audio;
                let videoTracks = DefaultWebRtcComponentView.videoTracks || [];
                for (var track of videoTracks)track.enabled = component.video;
            }
            component_onConnect(args, component, node, mediaDevicesPromise) {
                return __awaiter(this, void 0, void 0, function*() {
                    // Wait for the media devices promise from earlier...
                    console.log("[VERTX:WebRtcComponentController:onConnect] onConnect fired, handling peer connection once media devices are ready");
                    yield mediaDevicesPromise;
                    console.log("[VERTX:WebRtcComponentController:onConnect] media devices are ready. handling peer connection");
                    let context = `${component.sndContext}-${args.rcvContext}`;
                    if (node.HasToken === true) {
                        // ensure the local media is correctly enabled/disabled before connecting new person
                        this.setTracksEnabled(component);
                        let mediaSenderConnection = yield component.createConnectionAsync(context, node.Space);
                        let tracks = yield DefaultWebRtcComponentView.getLocalMediaTracks();
                        yield mediaSenderConnection.addTracks(tracks);
                    // don't send the offer here, it will be sent as a result of the 'negotationneeded' event
                    //await mediaSenderConnection.sendOfferAsync();
                    }
                });
            }
        }
        NodeComponentModel.DefaultWebRtcComponentController = DefaultWebRtcComponentController;
        class WebRtcConnection {
            constructor(context, space){
                this.context = null;
                this.signaler = null;
                this.peerConnection = null;
                this.offerSdpFragBuf = "";
                this.offerSdpSeq = -1;
                this.answerSdpFragBuf = "";
                this.answerSdpSeq = -1;
                this.context = context;
                this.signaler = new Vertex.DataChannel(space);
                this.signaler.id = context;
            }
            initAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.signaler.onMessage.on(this.signaler_onMessage.bind(this));
                    yield this.signaler.init();
                    let rtcConfig = {
                        iceServers: WebRtcConnection.defaultIceServers
                    };
                    this.peerConnection = new RTCPeerConnection(rtcConfig);
                    this.peerConnection.addEventListener("connectionstatechange", this.peerConnection_onConnectionStateChange.bind(this));
                    this.peerConnection.addEventListener("icecandidate", this.peerConnection_onIceCandidate.bind(this));
                    this.peerConnection.addEventListener("negotiationneeded", this.peerConnection_negotiationNeeded.bind(this));
                // todo: consider allowing the consumer to directly handle the track event
                //this.peerConnection.addEventListener("track", this.peerConnection_onTrack.bind(this));
                //this.peerConnection.addEventListener("removetrack", this.peerConnection_onRemoveTrack.bind(this));
                });
            }
            addTracks(tracks) {
                return __awaiter(this, void 0, void 0, function*() {
                    for (let track of tracks)this.peerConnection.addTrack(track);
                });
            }
            //addStreamWithDelay(stream: MediaStream /*, ...streams: MediaStream[] */) {
            //    //for (let stream of streams) {
            //        //if (stream.getAudioTracks().length > 0) {
            //        //    let audioTransceiver = this.peerConnection.addTransceiver("audio", {
            //        //        direction: "inactive"
            //        //    });
            //        //    audioTransceiver.sender.setStreams(stream);
            //        //    audioTransceiver.direction = "sendonly";
            //        //}
            //        if (stream.getVideoTracks().length > 0) {
            //            let videoTransceiver = this.peerConnection.addTransceiver("video", {
            //                direction: "inactive"
            //            });
            //            window.setTimeout(() => {
            //                videoTransceiver.sender.setStreams(stream);
            //                videoTransceiver.direction = "sendonly";
            //            }, 1000);
            //            return videoTransceiver;
            //        }
            //    //}
            //}
            //async addDummyTransciever() {
            //    let t = this.peerConnection.addTransceiver("video", {
            //        direction: "inactive"
            //    });
            //    return t;
            //}
            //async removeRandomStream() {
            //    let tArr = this.peerConnection.getTransceivers().filter((t) => {
            //        return t.sender.track && t.sender.track.kind == "audio";
            //    });
            //    let i = Math.floor(Math.random() * tArr.length);
            //    let t = tArr[i];
            //    console.log("Removing random audio sender", {
            //        all: tArr,
            //        selected: t
            //    });
            //    t.sender.replaceTrack(null);
            //    //t.direction = "inactive";
            //    //t.sender.track.stop();
            //    //if (typeof t.stop === "function")
            //    //    t.stop();
            //}
            sendOfferFragmentedAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    let offer = yield this.peerConnection.createOffer();
                    yield this.peerConnection.setLocalDescription(offer);
                    const maxFrag = 3072;
                    let fragmentsRequired = Math.floor(offer.sdp.length / maxFrag) + 1; // Math.floor because we want integer divison
                    for(let i = 0; i < fragmentsRequired; ++i){
                        let sdpFragment = offer.sdp.substr(maxFrag * i, maxFrag);
                        let last = i == fragmentsRequired - 1;
                        let message = {
                            type: "fragmented-offer",
                            seq: i,
                            last: last,
                            sdpFragment: sdpFragment
                        };
                        let json = JSON.stringify(message);
                        console.log("Sending Offer Fragment", {
                            length: json.length,
                            seq: i,
                            reqd: fragmentsRequired,
                            frag: sdpFragment,
                            last: last,
                            message: json
                        });
                        yield this.signaler.sendMessage(json);
                    }
                //let offerMessage: WebRtcSdpMessage = {
                //    type: "offer",
                //    message: {
                //        type: offer.type,
                //        sdp: offer.sdp
                //    }
                //};
                //let json = JSON.stringify(offerMessage);
                //console.log("SDP Offer", { length: json.length, message: json });
                //await this.signaler.sendMessage(json);
                });
            }
            sendAnswerFragmentedAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    let answer = yield this.peerConnection.createAnswer();
                    yield this.peerConnection.setLocalDescription(answer);
                    const maxFrag = 3072;
                    let fragmentsRequired = Math.floor(answer.sdp.length / maxFrag) + 1; // Math.floor because we want integer divison
                    for(let i = 0; i < fragmentsRequired; ++i){
                        let sdpFragment = answer.sdp.substr(maxFrag * i, maxFrag);
                        let last = i == fragmentsRequired - 1;
                        let message = {
                            type: "fragmented-answer",
                            seq: i,
                            last: last,
                            sdpFragment: sdpFragment
                        };
                        let json = JSON.stringify(message);
                        console.log("Sending Answer Fragment", {
                            length: json.length,
                            seq: i,
                            reqd: fragmentsRequired,
                            frag: sdpFragment,
                            last: last,
                            message: json
                        });
                        yield this.signaler.sendMessage(json);
                    }
                // Send answer message via Signal channel
                //let answerMsg: WebRtcSdpMessage = {
                //    type: "answer",
                //    message: {
                //        type: answer.type,
                //        sdp: answer.sdp
                //    }
                //};
                //await this.signaler.sendMessage(JSON.stringify(answerMsg));
                });
            }
            close() {
                if (this.peerConnection) {
                    this.peerConnection.close();
                    this.peerConnection = null;
                }
            }
            resetOfferSdpFragState() {
                this.offerSdpFragBuf = "";
                this.offerSdpSeq = -1;
            }
            resetAnswerSdpFragState() {
                this.answerSdpFragBuf = "";
                this.answerSdpSeq = -1;
            }
            signaler_onMessage(messageJson) {
                return __awaiter(this, void 0, void 0, function*() {
                    // todo: validate that the parameter is correct
                    try {
                        let message = JSON.parse(messageJson);
                        if (message.type === "fragmented-offer") {
                            console.debug(`[VERTX:WebRtcConnection:onSignalMessage] Offer Fragment Received`, {
                                message: message
                            });
                            let fragMessage = message;
                            // piece together the SDP.
                            // if final, then also handle it as an offer.
                            if (this.offerSdpSeq + 1 != fragMessage.seq) {
                                console.error("[VERTX:WebRtcConnection:onSignalMessage] Received out-of-sequence offer fragment, discarding current sequence. ", {
                                    expectedSeqNumber: this.offerSdpSeq + 1,
                                    receivedSeqNumber: fragMessage.seq,
                                    equal: this.offerSdpSeq + 1 == fragMessage.seq
                                });
                                this.resetOfferSdpFragState();
                                return;
                            }
                            this.offerSdpSeq = fragMessage.seq;
                            this.offerSdpFragBuf += message.sdpFragment;
                            if (message.last) {
                                // hack: call self with a complete sdp offer message
                                let sdp = this.offerSdpFragBuf;
                                let _newMsg = {
                                    type: "offer",
                                    message: {
                                        sdp: sdp,
                                        type: "offer"
                                    }
                                };
                                let _json = JSON.stringify(_newMsg);
                                this.resetOfferSdpFragState();
                                yield this.signaler_onMessage(_json);
                            }
                        }
                        if (message.type === "fragmented-answer") {
                            console.debug(`[VERTX:WebRtcConnection:onSignalMessage] Answer Fragment Received`, {
                                message: message
                            });
                            let fragMessage1 = message;
                            // piece together the SDP.
                            // if final, then also handle it as an offer.
                            if (this.answerSdpSeq + 1 != fragMessage1.seq) {
                                console.error("[VERTX:WebRtcConnection:onSignalMessage] Received out-of-sequence answer fragment, discarding current sequence. ", {
                                    expectedSeqNumber: this.answerSdpSeq + 1,
                                    receivedSeqNumber: fragMessage1.seq,
                                    equal: this.answerSdpSeq + 1 == fragMessage1.seq
                                });
                                this.resetAnswerSdpFragState();
                                return;
                            }
                            this.answerSdpSeq = fragMessage1.seq;
                            this.answerSdpFragBuf += message.sdpFragment;
                            if (message.last) {
                                // hack: call self with a complete sdp offer message
                                let sdp1 = this.answerSdpFragBuf;
                                let _newMsg1 = {
                                    type: "answer",
                                    message: {
                                        sdp: sdp1,
                                        type: "answer"
                                    }
                                };
                                let _json1 = JSON.stringify(_newMsg1);
                                this.resetAnswerSdpFragState();
                                yield this.signaler_onMessage(_json1);
                            }
                        }
                        if (message.type === "offer") {
                            console.debug(`[VERTX:WebRtcConnection:onSignalMessage] Offer Received`, {
                                message: message
                            });
                            let sdpMessage = message;
                            try {
                                // todo: previous implementation did not call "setRemoteDescription" here.
                                yield this.peerConnection.setRemoteDescription({
                                    type: "offer",
                                    sdp: sdpMessage.message.sdp
                                });
                            } catch (e) {
                                console.warn(`[VERTX:WebRtcConnection:onSignalMessage] Failed to set remote description (handling offer)`, {
                                    error: e,
                                    sdp: message.message
                                });
                            }
                            yield this.sendAnswerFragmentedAsync();
                        }
                        if (message.type === "answer") {
                            console.debug(`[VERTX:WebRtcConnection:onSignalMessage] Answer Received`, {
                                message: message
                            });
                            let sdpMessage1 = message;
                            try {
                                yield this.peerConnection.setRemoteDescription({
                                    type: "answer",
                                    sdp: sdpMessage1.message.sdp
                                });
                            } catch (e1) {
                                console.warn(`[VERTX:WebRtcConnection:onSignalMessage] Failed to set remote description (handling answer)`, {
                                    error: e1,
                                    sdp: message.message
                                });
                            }
                        }
                        if (message.type === "ice") {
                            let iceMsg = message;
                            console.debug(`[VERTX:WebRtcConnection:onSignalMessage] ICE Candidate Received`, {
                                message: message
                            });
                            // todo: verify that message has the correct format here.
                            // todo: possible bug source
                            // When ICE has finished in a browser, a 'null' candidate is produced.
                            // In some cases, another non-null candidate is produced with empty data.
                            // Both of these upset the peer connection if added. Our implementation avoids sending these,
                            // but we check again here to be sure.
                            // todo: check if this is supposed to receive the null ICE
                            let candidate = iceMsg.message.content;
                            try {
                                if (candidate && candidate.length > 0) {
                                    let iceCandidate = {
                                        candidate: iceMsg.message.content,
                                        sdpMid: iceMsg.message.sdpMid,
                                        sdpMLineIndex: iceMsg.message.sdpMlineIndex
                                    };
                                    yield this.peerConnection.addIceCandidate(iceCandidate);
                                } else console.warn("[VERTX:WebRtcConnection:onSignalMessage] Received null ICE candidate. This will be ignored, but the sending WebRTC implementation should take care not to send empty ICE candidates!", {
                                    message: message
                                });
                            } catch (e2) {
                                console.warn(`[VERTX:WebRtcConnection:onSignalMessage] Failed to add ICE candidate`, {
                                    error: e2,
                                    candidate: message.message
                                });
                            }
                        }
                    } catch (e3) {
                        debugger;
                        throw e3;
                    }
                });
            }
            peerConnection_onConnectionStateChange(event) {
                // According to MDN, this event type is just Event, and does not actually contain any info about
                // the connection state. They recommend reading directly from the peerConnection to read the connection info.
                console.debug(`[VERTX:WebRtcConnection:onConnecionStateChange] Connection State is now ${this.peerConnection.connectionState}`);
            }
            peerConnection_onIceCandidate(event) {
                return __awaiter(this, void 0, void 0, function*() {
                    // This is a noisy one. Only uncomment this when debugging is required.
                    // console.debug("[VERTX:WebRtcComponent:icecandidate]", { event: evt});
                    let candidate = event.candidate;
                    // When ICE has finished, the event sends a null candidate.
                    // In some implementations, a separate event is produced with a non-null candidate, but with no data.
                    // Both of these upset the peer connection if you pass null ICE candidates, so we wont send them.
                    if (candidate && candidate.candidate.length > 0) {
                        // todo: validate that this is the correct format to send
                        let iceMsg = {
                            type: "ice",
                            message: {
                                content: candidate.candidate,
                                sdpMid: candidate.sdpMid,
                                sdpMlineIndex: candidate.sdpMLineIndex
                            }
                        };
                        yield this.signaler.sendMessage(JSON.stringify(iceMsg));
                    }
                });
            }
            peerConnection_negotiationNeeded(evt) {
                return __awaiter(this, void 0, void 0, function*() {
                    let pc = evt.target;
                    console.log("[WebRtcConnection] [Re]negotiation Needed, creating and sending SDP...", {
                        peerConnection: pc
                    });
                    yield this.sendOfferFragmentedAsync();
                });
            }
        }
        WebRtcConnection.defaultIceServers = [
            {
                urls: "stun:public.stun.vertx.cloud:3478"
            },
            {
                urls: "turn:public.turn.vertx.cloud:3478",
                username: "visr",
                credential: "visr",
                credentialType: "password"
            }
        ];
        NodeComponentModel.WebRtcConnection = WebRtcConnection;
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
/// <reference path="../componentsystembase.ts"/>
/// <reference path="../rpc.ts"/>
/// <reference path="janusapi.ts"/>
/// <reference path="janussessionobserver.ts"/>
/// <reference path="webrtc-componentlifecycle.ts"/>
/// <reference path="mediafactory.ts"/>
// this ref is not required by this file but it's referenced here to keep the classes nearby
/// <reference path="webrtccomponent-legacy.ts"/>
/// <reference path="webrtcstats.ts"/>
var Vertex;
(function(Vertex) {
    let NodeComponentModel;
    (function(NodeComponentModel) {
        // component
        class WebRtcComponent extends NodeComponentModel.Component {
            constructor(){
                super();
                this.sndContext = "null";
                this.isActive = false;
                this.video = false;
                this.audio = false;
                /**
                 * the ID of the call that this component belongs to.
                 * if this value is unset, it should be assumed to be the space ID.
                 */ this.callId = "";
                // not serialized
                this.connections = new Map();
                /**
                 * (deprecated) this value is not used or serialzed.
                 * @deprecated
                 */ this.rcvContext = "null";
                this.sndContext = Vertex.Guid.NewGuid();
                this.callId = "";
                this.isActive = false;
                this.video = false;
                this.audio = false;
                this.onConnect = new NodeComponentModel.RPCEventBus("OnConnect", WebRtcOnConnectArgs);
                this.events.set(this.onConnect.eventName, this.onConnect);
                // not serialized
                this.rcvContext = Vertex.Guid.NewGuid();
            }
            writeData(writer, delta) {
                super.writeData(writer, delta);
                writer.setDebugState("[WebRtcComponent]", this);
                writer.writeString(this.sndContext);
                writer.writeBool(this.isActive);
                writer.writeBool(this.video);
                writer.writeBool(this.audio);
            }
            readData(reader) {
                super.readData(reader);
                reader.setDebugState("[WebRtcComponent]", this);
                this.sndContext = reader.readString();
                this.isActive = reader.readBool();
                this.video = reader.readBool();
                this.audio = reader.readBool();
            }
            bsonReadAction(name, type, reader) {
                //if (name === "SndContext" && type === Vertex.BsonType.String)
                if (name === "SndContext") {
                    reader.readString(this, "sndContext");
                    return;
                }
                //if (name === "IsActive" && type === Vertex.BsonType.Boolean)
                if (name === "IsActive") {
                    reader.readBoolean(this, "isActive");
                    return;
                }
                //if (name === "Video" && type === Vertex.BsonType.Boolean)
                if (name === "Video") {
                    reader.readBoolean(this, "video");
                    return;
                }
                //if (name === "Audio" && type === Vertex.BsonType.Boolean)
                if (name === "Audio") {
                    reader.readBoolean(this, "audio");
                    return;
                }
                if (name === "CallId") reader.readString(this, "callId");
            }
            readDataBSON(reader) {
                reader.readObject(this.bsonReadAction.bind(this));
            }
            writeDataBSON(writer) {
                let ctx = writer.startObject();
                writer.writeString("SndContext", this.sndContext);
                writer.writeString("CallId", this.callId);
                writer.writeBoolean("IsActive", this.isActive);
                writer.writeBoolean("Video", this.video);
                writer.writeBoolean("Audio", this.audio);
                writer.endObject(ctx);
            }
            /**
             * deprecated: only used by legacy webrtc component
             * @deprecated
             */ createConnectionAsync(context, space) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (this.connections.has("context")) throw new Error(`[VERTX:WebRtcComponent:createConnectionAsync] A connection already exists with context '${context}'.`);
                    let connection = new NodeComponentModel.WebRtcConnection(context, space);
                    yield connection.initAsync();
                    this.connections.set(context, connection);
                    return connection;
                });
            }
            /**
            * deprecated: only used by legacy webrtc component
            * @deprecated
            */ getConnection(context) {
                return this.connections.get(context);
            }
            /**
            * deprecated: only used by legacy webrtc component
            * @deprecated
            */ getConnections() {
                return this.connections.values();
            }
            /**
            * deprecated: only used by legacy webrtc component
            * @deprecated
            */ clearConnections() {
                for (let connection of this.connections.values())connection.close();
                this.connections.clear();
            }
        }
        NodeComponentModel.WebRtcComponent = WebRtcComponent;
        class WebRtcOnConnectArgs extends NodeComponentModel.Structure {
            constructor(){
                super();
                this.rcvContext = "null";
                this.rcvContext = "";
            }
            writeData(writer, delta) {
                super.writeData(writer, delta);
                writer.setDebugState("[WebRtcOnConnectArgs]", this);
                writer.writeString(this.rcvContext);
            }
            readData(reader) {
                super.readData(reader);
                reader.setDebugState("[WebRtcOnConnectArgs]", this);
                this.rcvContext = reader.readString();
            }
            bsonReadAction(name, type, reader) {
                if (name === "RcvContext") {
                    reader.readString(this, "rcvContext");
                    return;
                }
            }
            readDataBSON(reader) {
                reader.readObject(this.bsonReadAction.bind(this));
            }
            writeDataBSON(writer) {
                let ctx = writer.startObject();
                writer.writeString("RcvContext", this.rcvContext);
                writer.endObject(ctx);
            }
        }
        NodeComponentModel.WebRtcOnConnectArgs = WebRtcOnConnectArgs;
        /**
         * Prints message if condition is falsy.
         *
         * Does NOT throw/stop execution.
         * @param condition
         * @param message
         */ function assert(condition, message) {
            if (!condition) {
                // get a stack trace
                let err = new Error();
                console.error(`WebRTC Assertion Failed: ${message || "<no message>"}`, {
                    message: message,
                    stack: err.stack
                });
            }
        }
        class WebRtcComponentSystem2 {
            constructor(){
                // general settings
                this.iceServers = [
                    {
                        urls: "stun:public.stun.vertx.cloud:3478"
                    },
                    {
                        urls: "turn:public.turn.vertx.cloud:3478",
                        username: "visr",
                        credential: "visr",
                        credentialType: "password"
                    }
                ];
                this.remoteAudioEnabled = true;
                this.remoteVideoEnabled = true;
                this.localAudioEnabled = true;
                this.localVideoEnabled = true;
                this.mp3noiseurl = "/static/images/noise.mp3";
                this.oggnoiseurl = "/static/images/noise.ogg";
                // debug settings
                this.useDebugVp8Room = false;
                this.useDebugH264Room = false;
                // private/internal variables
                this.initTcs = null;
                this.sessionInfo = null;
                /** the janus api */ this.janus = null;
                this.sessionObserver = null;
                /** the janus videoroom handle for publishing */ this.janusVrHandlePublisher = null;
                this._publisherId = 0;
                this.localPublisherIdChanged = new NodeComponentModel._WebRTCEvent();
                this.peerConnectionsByVideoRoomHandle = new Map();
                // local media
                this.userMediaStream = null;
                this._callId = "";
                this._currentSpaceId = "";
                this.onresize_logScreenSize = ()=>{
                    this.statTracker.set("system", "screenSize", `${screen.width}x${screen.height}@${window.devicePixelRatio}`);
                };
                if (!WebRtcComponentSystem2._singletonInstance) WebRtcComponentSystem2._singletonInstance = this;
                this.initTcs = new NodeComponentModel.TaskCompletionSource();
                if (!this.statTracker) this.statTracker = new Vertex.WebRtc.WebRtcStatTracker();
                this.onWebRtcInitialized = new Vertex.EventBus();
                this.onWebRtcUninitialized = new Vertex.EventBus();
                this.userMediaFactory = new NodeComponentModel.DefaultWebRtcUserMediaFactory();
            }
            get publisherId() {
                return this._publisherId;
            }
            /**
             * can be set to a guid to join a specific call.
             * if this is unset/an empty string, the current VERTX Space ID will be used as the Call ID.
             *
             * the callId will be converted to lowercase on set.
             */ get callId() {
                return this._callId;
            }
            set callId(value) {
                // todo: validate guid
                if (this.isInitialized) throw new Error("callId cannot be changed while WebRTC is initialized. Uninitialize WebRTC (and await shutdown) before changing callId.");
                this._callId = value && value.toLowerCase() || "";
            }
            get spaceId() {
                return this._currentSpaceId;
            }
            createSystem() {
                let view = new NodeComponentModel.WebRtcComponentView2Impl(this, WebRtcComponentView2);
                let controller = new NodeComponentModel.WebRtcComponentController2Impl(this, WebRtcComponentController2);
                let system = new NodeComponentModel.WebRtcComponentSystem2Impl(this, "WebRtc", view, controller);
                return system;
            }
            createComponent() {
                return new WebRtcComponent();
            }
            /** returns the instance of the system. this is for convenience and has undefined behaviour
             * if multiple instances have been created. */ static getInstance() {
                return this._singletonInstance;
            }
            /** enables webrtc calling.
             * ideally, this should be called directly by a user interaction (such as clicking a 'join call' button). this will help prevent
             * any potential issues with autoplay/muted video etc */ initializeWebRtc() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.checkForWebRtcAdapter();
                    this.statTracker.set("system", "initialized", true);
                    this.initNoiseElement();
                    // todo: this space should be the one associated to the component system, not just the singleton.
                    let space = Vertex.Globals.runtime.space;
                    let spaceId = space.id;
                    this._currentSpaceId = spaceId;
                    let vpId = space.spaceLink.client.ViewpointId;
                    let tkn = Vertex.Globals.bearerToken;
                    if (this.callId) {
                        this.statTracker.set("system", "vertexIds.originalSpaceId", spaceId, true);
                        this.statTracker.set("system", "vertexIds.usingCustomCallId", "true", true);
                        console.log(`[WebRtcComponentSystem] CallId is set: connecting to ${this.callId} instead of ${spaceId}`);
                        spaceId = this.callId;
                    }
                    // telemetry for screen size
                    // todo: unbind?
                    window.addEventListener("resize", this.onresize_logScreenSize);
                    this.onresize_logScreenSize();
                    this.statTracker.set("system", "uaString", navigator.userAgent);
                    this.statTracker.set("system", "vertexIds.stack", Vertex.Globals.vertexStackUrl);
                    this.statTracker.set("system", "vertexIds.spaceId", spaceId, true);
                    this.statTracker.set("system", "vertexIds.viewpointId", vpId, true);
                    this.janus = new NodeComponentModel.JanusApi(`https://${Vertex.Globals.vertexStackUrl}/`);
                    // some extra logic here - if we're running off-stack, a bearer token must be set
                    if (!tkn) {
                        let runningOnVertex = location.hostname === "vertx.cloud" || location.hostname.endsWith(".vertx.cloud");
                        if (!runningOnVertex) throw new Error("You must set Vertex.Globals.bearerToken to use WebRTC");
                    } else this.janus.setBearerToken(tkn);
                    if (!spaceId || !vpId) // log in case the caller didnt await the task
                    throw new Error("Init failed. Maybe you're not connected to the space yet? (Space or Viewpoint ID is not set, or not authenticated)");
                    if (this.useDebugVp8Room) {
                        this.statTracker.set("system", "debug.forceVp8Room", true);
                        console.warn("[WebRtcComponentSystem] DEBUG: Force joining room VP8 Test Room");
                    }
                    if (this.useDebugH264Room) {
                        this.statTracker.set("system", "debug.forceH264Room", true);
                        console.warn("[WebRtcComponentSystem] DEBUG: Force joining room H264 Test Room");
                    }
                    this.statTracker.set("system", "vertexIds.sessionId", "pending");
                    this.statTracker.set("system", "vertexIds.roomId", "pending");
                    this.sessionInfo = yield this.janus.createVertexWebRtcSessionAsync(spaceId, vpId, this.useDebugVp8Room, this.useDebugH264Room);
                    if (this.sessionInfo == null) {
                        this.statTracker.set("system", "vertexIds.sessionId", "Failed!!");
                        this.statTracker.set("system", "vertexIds.roomId", "Failed!!");
                        // log in case the caller didnt await the task
                        throw new Error("Init failed. Failed to create session. Try again later.");
                    }
                    this.statTracker.set("system", "vertexIds.sessionId", this.sessionInfo.jSession, true);
                    this.statTracker.set("system", "vertexIds.roomId", this.sessionInfo.roomId, true);
                    let observer = new NodeComponentModel.JanusSessionObserver(this.janus, this.statTracker);
                    observer.onError.add(this.observer_onError, this);
                    observer.onKeepAlive.add(this.observer_onKeepAlive, this);
                    observer.onEvent.add(this.observer_onEvent, this);
                    observer.onVideoRoomEvent.add(this.observer_onVideoRoomEvent, this);
                    observer.onWebRtcUp.add(this.observer_onWebRtcUp, this);
                    observer.onWebRtcHangup.add(this.observer_onWebRtcHangup, this);
                    observer.onWebRtcMedia.add(this.observer_onWebRtcMedia, this);
                    observer.onWebRtcSlowLink.add(this.observer_onWebRtcSlowLink, this);
                    observer.observeSession(this.sessionInfo.jSession, spaceId, vpId);
                    this.sessionObserver = observer;
                    this.statTracker.set("system", "vertexIds.publishHandle", "Pending");
                    // note: we make one handle now for publishing, and then we create more later for subscribing
                    var vrResult = yield this.janus.createVideoRoomPluginHandle(this.sessionInfo.jSession);
                    if (vrResult.error) {
                        this.statTracker.set("system", "vertexIds.publishHandle", "Failed!");
                        // log in case the caller didnt await the task
                        console.error("vrResult error", vrResult.error);
                        throw new Error("Init failed. Couldn't join VideoRoom as Publisher");
                    }
                    this.statTracker.set("system", "vertexIds.publishHandle", vrResult.handle, true);
                    this.janusVrHandlePublisher = vrResult.handle;
                    // join as publisher (required for both view and controller - controller explicitly starts publishing later)
                    this.statTracker.set("system", "publishJoined", "Pending");
                    // hack: send a few invalid async requests to the videoroom. this will help flush out events from a previous observer
                    // so we don't miss messages.
                    for(let i = 0; i < 3; ++i){
                        this.statTracker.set("system", "publishJoined", `FlushingMessages: ${i + 1} of 3`);
                        yield this.janus.leaveVideoRoom(this.sessionInfo.jSession, this.janusVrHandlePublisher);
                    }
                    this.statTracker.set("system", "publishJoined", `Joining`);
                    // todo: join as publisher (required for both view and controller - controller explicitly starts publishing later)
                    var joinResult = yield this.janus.joinVideoRoomAsPublisher(this.sessionInfo.jSession, this.janusVrHandlePublisher, this.sessionInfo.roomId, "Web User");
                    if (joinResult.error) {
                        console.error("joinResult error", joinResult.error);
                        throw new Error("Init failed. Couldn't join VideoRoom as Publisher");
                    }
                    this.statTracker.set("system", "publishJoined", !joinResult.error);
                    // the result of this message shows up as a message/event on the observer
                    this.initTcs.trySetResult();
                    this.onWebRtcInitialized.trigger({
                        sender: this
                    });
                });
            }
            setPeerConnectionForHandle(handle, peerConnection) {
                if (peerConnection) this.peerConnectionsByVideoRoomHandle.set(handle, peerConnection);
                else this.peerConnectionsByVideoRoomHandle.delete(handle);
            }
            getVideoRoomPublishHandle() {
                return this.janusVrHandlePublisher;
            }
            createVideoRoomHandle() {
                return __awaiter(this, void 0, void 0, function*() {
                    let result = yield this.janus.createVideoRoomPluginHandle(this.sessionInfo.jSession);
                    if (result.error) throw result.error;
                    return result.handle;
                });
            }
            destroyVideoRoomHandle(handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    let result = yield this.janus.detachPluginHandle(this.sessionInfo.jSession, handle);
                    if (result.error) throw result.error;
                    return;
                });
            }
            setStatsWindowVisible(isVisible) {
                this.statTracker.setWindowVisible(isVisible);
            }
            subscribeTo(handle, publisherId) {
                return __awaiter(this, void 0, void 0, function*() {
                    console.debug("[WebRTC] Subscribing with settings ", {
                        audioEnabled: this.remoteAudioEnabled,
                        videoEnabled: this.remoteVideoEnabled
                    });
                    if (handle == 0) throw new Error("Invalid Handle");
                    let result = yield this.janus.videoRoomSubscribe(this.sessionInfo.jSession, handle, publisherId, this.sessionInfo.roomId, this.remoteAudioEnabled, this.remoteVideoEnabled);
                    if (result.error) throw result.error;
                });
            }
            unsubscribeFrom(handle, publisherId) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (handle == 0) throw new Error("Invalid Handle");
                    let result = yield this.janus.leaveVideoRoom(this.sessionInfo.jSession, handle);
                    if (result.error) throw result.error;
                });
            }
            switchSubscriptionTo(handle, publisherId) {
                return __awaiter(this, void 0, void 0, function*() {
                    console.debug("[WebRTC] Switching to new publisher " + publisherId);
                    if (handle == 0) throw new Error("Invalid Handle");
                    let result = yield this.janus.videoRoomSwitch(this.sessionInfo.jSession, handle, publisherId);
                    if (result.error) throw result.error;
                    let result2 = yield this.janus.videoRoomConfigureRestart(this.sessionInfo.jSession, handle);
                    if (result2.error) throw result2.error;
                });
            }
            sendJsep(handle, type, content) {
                return __awaiter(this, void 0, void 0, function*() {
                    if (handle === this.janusVrHandlePublisher) yield this.janus.publishToVideoRoom(this.sessionInfo.jSession, handle, this.localAudioEnabled, this.localVideoEnabled, type, content);
                    else yield this.janus.startSubscribe(this.sessionInfo.jSession, handle, type, content);
                });
            }
            sendIce(handle, sdpMid, sdpMlineIndex, content) {
                return __awaiter(this, void 0, void 0, function*() {
                    yield this.janus.sendTrickleIce(this.sessionInfo.jSession, handle, sdpMid, sdpMlineIndex, content);
                });
            }
            sendIceComplete(handle) {
                return __awaiter(this, void 0, void 0, function*() {
                    yield this.janus.sendTrickleIceCompleted(this.sessionInfo.jSession, handle);
                });
            }
            observer_onKeepAlive(sender, data) {
            // console.log(`Received KeepAlive from Janus`, data);
            }
            observer_onEvent(sender, data) {
                console.debug(`[WebRTC] Janus Event`, data);
            }
            observer_onWebRtcUp(sender, data) {
                console.log("[WebRTC] WebRTC Up! (Janus connection established)", data);
                this.statTracker.set(`vrh${data.sender}`, "backchannel.status", "WebRtcUp");
                this.statTracker.set(`vrh${data.sender}`, "backchannel.statusTime", new Date());
            }
            observer_onWebRtcHangup(sender, data) {
                console.warn("[WebRTC] WebRTC Hangup! (Janus WebRTC connection ended)", data);
                this.statTracker.set(`vrh${data.sender}`, "backchannel.status", `WebRtcHangup Reason: ${data.reason}`);
                this.statTracker.set(`vrh${data.sender}`, "backchannel.statusTime", new Date());
            }
            observer_onWebRtcMedia(sender, data) {
                this.statTracker.set(`vrh${data.sender}`, `media_${data.type}.serverReceiving`, data.receiving);
                if (data.receiving) console.debug(`[WebRTC] Janus is now receiving ${data.type} (vrh ${data.sender})`, data);
                else console.warn(`[WebRTC] Janus is no longer receiving ${data.type} (vrh ${data.sender})`, data);
            }
            observer_onWebRtcSlowLink(sender, data) {
                let direction = data.uplink ? "up" : "down";
                this.statTracker.set(`vrh${data.sender}`, `slowlink_${direction}`, data.nacks);
                this.statTracker.increment(`vrh${data.sender}`, `slowlink_${direction}_total`, data.nacks);
                console.log(`[WebRTC] Slow ${direction}link - ${data.nacks} nacks`, data);
            }
            observer_onVideoRoomEvent(sender, data) {
                return __awaiter(this, void 0, void 0, function*() {
                    let videoRoomData = data.plugindata.data;
                    let videoRoomMessage = videoRoomData.videoroom;
                    if (videoRoomMessage == "event") // The "configured" message is generally a response to 'publish'/'configure' messages when we start sending.
                    // However, it is also received if a stream we're subscribing to needs to re-negotiate.
                    {
                        if (videoRoomData.configured === "ok") {
                            let acodec = videoRoomData.audio_codec || "unknown";
                            let vcodec = videoRoomData.video_codec || "unknown";
                            console.debug(`[WebRTC] Video Room Reconfigured. Using codecs ${vcodec}/${acodec}. Handling JSEP...`, data);
                            let vrHandle = data.sender;
                            let pc = this.peerConnectionsByVideoRoomHandle.get(vrHandle);
                            if (!pc) console.error("[WebRTC] Received configure for a peerconnection we haven't set up yet!");
                            if (!data.jsep) console.error("[WebRTC] Expected JSEP with 'configured' event!");
                            else {
                                //this.fixSdp(data.jsep);
                                yield pc.setRemoteDescription({
                                    type: data.jsep.type,
                                    sdp: data.jsep.sdp
                                });
                                // if this was an offer (such as if janus asked us to renegotiate)
                                // then we need to create an answer
                                if (data.jsep.type == "offer") {
                                    let answer = yield pc.createAnswer();
                                    console.log(`Sending answer`, answer);
                                    yield pc.setLocalDescription(answer);
                                    yield this.sendJsep(vrHandle, answer.type, answer.sdp);
                                }
                            }
                        }
                    }
                    // handle "joined" message, which is sent in response to a publisher joining.
                    // We use this to find our own publisher ID for later use.
                    if (videoRoomMessage == "joined") {
                        let room = videoRoomData.room;
                        let desc = videoRoomData.description || "<no description>";
                        let myId = videoRoomData.id;
                        this._publisherId = myId;
                        this.localPublisherIdChanged.invoke(this, this._publisherId);
                        console.log(`[WebRTC] Joined Room ${room} (${desc}) successfully! Our publisher ID is ${myId}`);
                    }
                    // the "attached" message is fired when we have sent a "subscribe" message that was successful.
                    // it tells us the "id" (presumbaly the same publisher id we already told it)
                    // and also tells us the display name.
                    // It will be accompanied by a jsep offer, which we should handle.
                    // the "sender" property on the root will help us find the right peer connection.
                    if (videoRoomMessage == "attached") {
                        let room1 = videoRoomData.room;
                        let pubId = videoRoomData.id;
                        let pubDisplay = videoRoomData.display || "<no name>";
                        if (pubId == this.publisherId) {
                            console.log(`Not subscribing to ${pubId} (${pubDisplay}) because that's our own stream`);
                            return;
                        }
                        console.debug(`[WebRTC] Subscribing to ${pubId} (${pubDisplay}) in room ${room1}...`);
                        let senderHandle = data.sender;
                        let pc1 = this.peerConnectionsByVideoRoomHandle.get(senderHandle);
                        if (pc1) {
                            var jsep = data.jsep;
                            console.debug(`[WebRTC] Applying incoming SDP for ${pubId}`, jsep);
                            yield pc1.setRemoteDescription({
                                type: jsep.type,
                                sdp: jsep.sdp
                            });
                            let answer1 = yield pc1.createAnswer();
                            console.debug(`[WebRTC] Sending asnwer for ${pubId}`, answer1);
                            yield pc1.setLocalDescription(answer1);
                            yield this.sendJsep(senderHandle, answer1.type, answer1.sdp);
                        } else console.error(`[WebRTC] No peer connection registered for ${pubId}`);
                    }
                });
            }
            observer_onError(sender, data) {
                console.error(`Observer Error`, data);
            }
            uninitializeWebRtc() {
                return __awaiter(this, void 0, void 0, function*() {
                    this.initTcs.trySetCancelled();
                    this.initTcs = new NodeComponentModel.TaskCompletionSource();
                    // leave the room
                    yield this.janus.leaveVideoRoom(this.sessionInfo.jSession, this.janusVrHandlePublisher);
                    try {
                        // destroy the publisher handle
                        yield this.janus.detachPluginHandle(this.sessionInfo.jSession, this.janusVrHandlePublisher);
                    } catch (_a) {
                    // doesn't matter if this fails
                    }
                    this.janusVrHandlePublisher = 0;
                    // set the publisherid back to 0
                    this._publisherId = 0;
                    this.localPublisherIdChanged.invoke(this, this.publisherId);
                    // ensure all connections were destroyed 
                    for (let [handle, pc] of this.peerConnectionsByVideoRoomHandle.entries()){
                        assert(!pc, `The PeerConnection for ${handle} has not been destroyed. Destroying now.`);
                        if (pc) pc.close();
                    }
                    this.peerConnectionsByVideoRoomHandle.clear();
                    if (this.sessionObserver) {
                        this.sessionObserver.destroy();
                        this.sessionObserver = null;
                    }
                    this.sessionInfo = null;
                    this.janus = null;
                    this.onWebRtcUninitialized.trigger({
                        sender: this
                    });
                });
            }
            isInitializedAsyncTask() {
                return __awaiter(this, void 0, void 0, function*() {
                    return this.initTcs.task;
                });
            }
            get isInitialized() {
                return this.initTcs.isCompleted;
            }
            // todo: convert this to a factory too
            initNoiseElement() {
                // Create an element to play some background noise.
                // This not only assures the user that a call is active, but helps autoplay run reliably.
                if (!this.noiseElement) {
                    let audio = document.createElement("audio");
                    audio.id = "vertexDefaultWebRtcComponent_noiseElement";
                    audio.style.display = "none";
                    audio.autoplay = true;
                    audio.loop = true;
                    audio.controls = false;
                    // playsInline is a safari-only attribute for iOS - and generally only concerns video.
                    // always good to be safe though.
                    audio["playsinline"] = true;
                    audio["playsInline"] = true;
                    document.body.appendChild(audio);
                    this.noiseElement = audio;
                }
                // Clear any existing sources and add new
                for (let child of this.noiseElement.childNodes)child.parentNode.removeChild(child);
                let mp3src = document.createElement("source");
                mp3src.src = this.mp3noiseurl;
                let oggsrc = document.createElement("source");
                oggsrc.src = this.oggnoiseurl;
                this.noiseElement.appendChild(mp3src);
                this.noiseElement.appendChild(oggsrc);
                // Attempt to play the noise element.
                // If it fails, then warn the dev that autoplay wont work.
                let playPromise = this.noiseElement.play();
                if (playPromise instanceof Promise) {
                    let errMsg = "[VERTX:DefaultWebRtcComponentView:initializeWebRtc] The WebRTC Background Noise could not be autoplayed.\nTry calling initializeWebRtc again as a result of direct user interaction (e.g. a mouse click).\nSome WebRTC elements may fail to autoplay without user interaction.";
                    try {
                        playPromise.then((_)=>{
                            // autoplay succeeded
                            console.log("[VERTX:WebRtcComponentSystem:initializeWebRtc] Successfully started playing the WebRTC Background Noise. Autoplays should succeed reliably.");
                        }).catch((err)=>{
                            // autoplay failed
                            console.error(errMsg, err);
                        });
                    } catch (err2) {
                        // catch in case we are in a browser that doesn't support Promise.catch
                        console.error(errMsg, err2);
                    }
                }
            }
            checkForWebRtcAdapter() {
                // inject webrtc adapter. this improves webrtc compatibility across browsers.
                if (!window["adapter"]) {
                    // if running on VERTX, then we can just load the adapter
                    let vertexHosts = [
                        "vertx.cloud",
                        "nx-staging.vertx.cloud",
                        "dev.vertx.cloud"
                    ];
                    if (vertexHosts.indexOf(location.host) >= 0) {
                        let ele = document.createElement("script");
                        ele.src = `/runtime/js/webrtc-adapter/adapter.js`;
                        document.body.appendChild(ele);
                    } else {
                        // not running on VERTX - we can still load from VERTX if the stack URL is set
                        if (Vertex.Globals.vertexStackUrl) try {
                            let uri = new URL(Vertex.Globals.vertexStackUrl);
                            if (vertexHosts.indexOf(uri.host) >= 0) {
                                console.error(`[WebRtcComponentSystem.initializeWebRtc] WebRTC Adapter (adapter.js) has not been loaded.\nTo maximize WebRTC compatibility, adapter.js should ` + `be loaded before init. adapter is available from npm at 'webrtc-adapter', with a version of at least 7.7.0\n\n` + `Adapter will automatically be loaded from VERTX, but this behaviour will be removed in the future.`);
                                let ele1 = document.createElement("script");
                                ele1.src = `https://${uri.host}/runtime/js/webrtc-adapter/adapter.js`;
                                document.body.appendChild(ele1);
                            } else throw new Error("invalid stack url");
                        } catch (_a) {
                            console.error(`[WebRtcComponentSystem.initializeWebRtc] WebRTC Adapter (adapter.js) has not been loaded.\nTo maximize WebRTC compatibility, adapter.js should ` + `be loaded before WebRTC init. The 'webrtc-adapter' package is available on NPM, and should be loaded with a version of at least 7.7.0`);
                        }
                        else console.error(`[WebRtcComponentSystem.initializeWebRtc] WebRTC Adapter (adapter.js) has not been loaded.\nTo maximize WebRTC compatibility, adapter.js should ` + `be loaded before WebRTC init. The 'webrtc-adapter' package is available on NPM, and should be loaded with a version of at least 7.7.0`);
                    }
                }
            }
        }
        WebRtcComponentSystem2._singletonInstance = null;
        NodeComponentModel.WebRtcComponentSystem2 = WebRtcComponentSystem2;
        class WebRtcComponentView2 extends NodeComponentModel.BaseWebRtcComponentView {
            constructor(){
                super(...arguments);
                this.initTcs = new NodeComponentModel.CancellationTokenSource();
                /** the videoroom handle for this view's janus subscription */ this.subscriberHandle = Promise.resolve(0);
                this.currentSubscriptionId = 0;
                this.currentSubscriptionInfo = null;
                this._hasSubscribedToAny = false;
            }
            isValidCall() {
                // if the view doesn't match the call ID, completely ignore it.
                let componentCallId = this.component.callId.toLowerCase();
                if (!componentCallId) componentCallId = this.system.spaceId;
                this.system.statTracker.set(`View ${this.node.id}`, "callId", componentCallId, false);
                if (componentCallId != this.system.callId) {
                    this.system.statTracker.set(`View ${this.node.id}`, "ignored", "yes: callId does not match", false);
                    return false;
                }
                this.system.statTracker.set(`View ${this.node.id}`, "ignored", "no: callId matches", false);
                return true;
            }
            // Vertex
            bindComponent(system, node, component) {
                this.system.statTracker.set(`View ${node.id}`, "bound", true);
                // store the bound handler so we can unbind it later
                this.changeHandler = this.component_onChanged.bind(this);
                component.onChanged.on(this.changeHandler);
                // Bind listeners for reacting to init/uninit
                this.initHandler = this.system_onWebRtcInitialized.bind(this);
                system.onWebRtcInitialized.on(this.initHandler);
                this.uninitHandler = this.system_onWebRtcUninitialized.bind(this);
                system.onWebRtcUninitialized.on(this.uninitHandler);
                // Fire the init behaviour if already inited
                if (system.isInitialized) this.startWebRtcAsync(this.initTcs).catch(this.logErrors);
            }
            unbindComponent(system, node, component) {
                this.system.statTracker.set(`View ${node.id}`, "bound", false);
                // unbind the bound handler
                if (this.changeHandler) component.onChanged.off(this.changeHandler);
                this.changeHandler = null;
                // Unbind listeners for reacting to init/uninit
                if (this.initHandler) system.onWebRtcInitialized.off(this.initHandler);
                this.initHandler = null;
                if (this.uninitHandler) system.onWebRtcUninitialized.off(this.uninitHandler);
                this.uninitHandler = null;
                this.initTcs.cancel();
                // unconditionally stop. don't pass the cancellation token since we just cancelled it
                this.stopWebRtcAsync().catch(this.logErrors);
            }
            // System Events
            system_onWebRtcInitialized(args) {
                this.startWebRtcAsync().catch(this.logErrors);
            }
            system_onWebRtcUninitialized(args) {
                this.stopWebRtcAsync().catch(this.logErrors);
            }
            // Vertex Events
            component_onChanged(basecomp) {
                return __awaiter(this, void 0, void 0, function*() {
                    let component = basecomp;
                    var ctx = component.sndContext;
                    console.debug(`[WebRTC] WebRtcComponent Changed: Context: ${ctx}, Audio: ${component.audio}, Video: ${component.video}`);
                    let publisherId = this.parseHandle(ctx);
                    this.currentSubscriptionId = publisherId;
                    this.system.statTracker.set(`View ${this.node.id}`, "subscriptionId", this.currentSubscriptionId, true);
                    this.updateSubscriptionState();
                });
            }
            // WebRtc
            startWebRtcAsync(ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    ct = NodeComponentModel.CancellationTokenSource.ensure(ct);
                    this.system.statTracker.set(`View ${this.node.id}`, "callId", this.component.callId, true);
                    if (!this.isValidCall()) return;
                    this.subscriberHandle = this.system.createVideoRoomHandle();
                    yield this.subscriberHandle;
                    this._hasSubscribedToAny = false;
                    let publisherId = this.parseHandle(this.component.sndContext);
                    this.currentSubscriptionId = publisherId;
                    // trigger the change to ubsub/sub
                    this.updateSubscriptionState();
                });
            }
            stopWebRtcAsync(stopImmediate, ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    ct = NodeComponentModel.CancellationTokenSource.ensure(ct);
                    // if we have time, try nicely to clear up
                    if (!stopImmediate) {
                        let self = this;
                        this.subscriberHandle.then((handle)=>{
                            try {
                                // try this but it may fail if the session has already been destroyed.
                                return self.system.destroyVideoRoomHandle(handle);
                            } catch (_a) {
                                // doesn't matter if this fails
                                return null;
                            }
                        });
                        this.subscriberHandle = Promise.resolve(0);
                    }
                    this.currentSubscriptionId = 0;
                    this.updateSubscriptionState();
                });
            }
            // View Stuff
            updateSubscriptionState() {
                let currentId = this.currentSubscriptionInfo && this.currentSubscriptionInfo.publisherId || 0;
                // if the newly updated subscriber ID is the same as the one we're already subscribed to, then there's nothing to do
                if (currentId == this.currentSubscriptionId) return;
                // otherwise, bin the last connection and start a new one
                if (this.currentSubscriptionInfo && typeof this.currentSubscriptionInfo.cancel === "function") {
                    this.currentSubscriptionInfo.cancel();
                    this.currentSubscriptionInfo = null;
                }
                // don't view ourselves
                if (this.node.HasToken == false && this.currentSubscriptionId != 0) this.currentSubscriptionInfo = this.subscribeToCurrent();
            }
            subscribeToCurrent() {
                let info = new WebRtcViewSubscriptionInfo(this.currentSubscriptionId, this, this.system.remoteMediaFactory);
                info.initAsync().catch(this.logErrors);
                return info;
            }
            // utils
            parseHandle(raw) {
                let result = +raw;
                if (typeof result != "number") {
                    console.warn(`Invalid handle - ${raw} is not a number type`);
                    return 0;
                }
                if (isNaN(result)) {
                    console.warn(`Invalid handle - ${raw} is Not a Number`);
                    return 0;
                }
                if (!Number.isInteger(result)) {
                    console.warn(`Invalid handle - ${raw} is not an integer`);
                    return 0;
                }
                if (result < 0) {
                    console.warn(`Invalid handle - ${raw} is not a positive integer`);
                    return 0;
                }
                return result;
            }
            logErrors(error) {
                console.error(`A promise faulted in WebRtcComponentView`, error);
            }
        }
        NodeComponentModel.WebRtcComponentView2 = WebRtcComponentView2;
        class WebRtcComponentController2 extends NodeComponentModel.BaseWebRtcComponentController {
            constructor(){
                super(...arguments);
                this.initCts = new NodeComponentModel.CancellationTokenSource();
                this.publisherId = 0;
                this.isWebRtcUp = false;
                this.publisherHandle = 0;
                this.mediaFactoryContext = null;
                this.mediaFactoryWasInitialized = false;
                this.peerConnection = null;
                this.localMediaStream = null;
            }
            // Vertex
            bindComponent(system, node, component) {
                this.system.statTracker.set(`Controller ${node.id}`, "bound", true);
                // component changed
                this.changedHandler = this.component_onComponentChanged.bind(this);
                component.onChanged.on(this.changedHandler);
                // system init/uninit
                this.initHandler = this.system_onWebRtcInitialized.bind(this);
                system.onWebRtcInitialized.on(this.initHandler);
                this.uninitHandler = this.system_onWebRtcUninitialized.bind(this);
                system.onWebRtcUninitialized.on(this.uninitHandler);
                // assert some important stuff for later
                assert(this.system.localMediaFactory, "localMediaFactory is not set on the WebRtcComponentSystem - errors will occur if this client attempts to send audio/video in a WebRTC call");
                assert(this.system.userMediaFactory, "userMediaFactory is not set on the WebRtcComponentSystem - errors will occur if this client attempts to send audio/video in a WebRTC call");
                // fire init if already inited
                if (system.isInitialized) this.startWebRtcAsync(this.initCts).catch(this.logErrors);
            }
            unbindComponent(system, node, component) {
                this.system.statTracker.set(`Controller ${node.id}`, "bound", false);
                // unbind the bound handler
                if (this.changedHandler) component.onChanged.off(this.changedHandler);
                this.changedHandler = null;
                // Unbind listeners for reacting to init/uninit
                if (this.initHandler) system.onWebRtcInitialized.off(this.initHandler);
                this.initHandler = null;
                if (this.uninitHandler) system.onWebRtcUninitialized.off(this.uninitHandler);
                this.uninitHandler = null;
                // cancel init 
                this.initCts.cancel();
                // unconditionally stop. don't pass the cancellation token since we just cancelled it
                this.stopWebRtcAsync().catch(this.logErrors);
                var _a;
                return;
            }
            // System Events
            system_onWebRtcInitialized(args) {
                this.startWebRtcAsync(this.initCts).catch(this.logErrors);
            }
            system_onWebRtcUninitialized(args) {
                this.stopWebRtcAsync().catch(this.logErrors);
            }
            // WebRTC
            startWebRtcAsync(ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    ct = NodeComponentModel.CancellationTokenSource.ensure(ct);
                    this.system.localPublisherIdChanged.add(this.system_localPublisherIdChanged, this);
                    this.system.sessionObserver.onWebRtcUp.add(this.sessionObserver_onWebRtcUp, this);
                    this.publisherHandle = this.system.getVideoRoomPublishHandle();
                    assert(!this.publisherId, "publisherId was set earlier than expected");
                    assert(!this.isWebRtcUp, "webrtcup was set earlier than expected");
                    // write 0 to the component
                    this.updatePublishingState();
                    // if we happen to already know our publisher id, then we can just set this now.
                    // if not, it'll get sent once we start broadcasting
                    this.publisherId = this.system.publisherId;
                    this.updatePublishingState();
                    assert(this.node && this.node.HasToken, "node no longer exists or we don't own the token");
                    if (this.node && this.node.HasToken) yield this.createPeerConnectionAsync(ct);
                });
            }
            stopWebRtcAsync(stopImmediate, ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    ct = NodeComponentModel.CancellationTokenSource.ensure(ct);
                    if (this.system && this.system.sessionObserver) // note: this is commented out in the cs code as of vertex-client-unity#0ddcdfeb4cf17290fe5fc63a7624f57cbc87d21d
                    // but does not seem to cause any issues there?
                    // this.system.localPublisherIdChanged.remove(this.system_localPublisherIdChanged);
                    this.system.sessionObserver.onWebRtcUp.remove(this.sessionObserver_onWebRtcUp);
                    // the system still holds the actual handle - the system itself will destroy it
                    // when needed
                    this.publisherHandle = 0;
                    this.publisherId = 0;
                    this.isWebRtcUp = false;
                    this.updatePublishingState();
                    yield this.destroyPeerConnectionAsync();
                    // sanity checks
                    assert(!this.component || this.component.sndContext == "0", "component.sndContext has not been reset on cleanup");
                    assert(!this.mediaFactoryContext, "media factory was not destroyed on cleanup");
                    assert(!this.mediaFactoryWasInitialized, "media factory was not de-inited on cleanup");
                    assert(!this.publisherHandle, "publisherHandle was not reset");
                    assert(!this.publisherId, "publisherId was not reset");
                });
            }
            updatePublishingState() {
                if (this.node && this.node.HasToken) {
                    if (this.isWebRtcUp) this.component.sndContext = "" + this.publisherId;
                    else this.component.sndContext = "0";
                    this.component.triggerOnChanged();
                }
            }
            updateAudioVideoEnabledStates() {
                if (this.localMediaStream) {
                    let audioTracks = this.localMediaStream.getAudioTracks();
                    let videoTracks = this.localMediaStream.getVideoTracks();
                    for (let track of audioTracks)track.enabled = this.component.audio;
                    for (let track1 of videoTracks)track1.enabled = this.component.video;
                }
            }
            createPeerConnectionAsync(ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    assert(this.system.isInitialized, "system is not initialized");
                    assert(!this.mediaFactoryWasInitialized && !this.mediaFactoryContext, "media has already been instantiated");
                    assert(this.system.localMediaFactory, "no local media factory was provided");
                    // from now, most stats are associated to the janus handle rather than the node.
                    this.system.statTracker.set(`Controller ${this.node.id}`, "vrHandle", this.publisherHandle);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "node.id", this.node.id);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "node.kind", "controller/sender");
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "peerConnection", "creating...");
                    //this.system.statTracker.set(`vrh${this.publisherHandle}`, "turnServers", "todo");
                    // we create the peerconnection ourselves before invoking the local media factory
                    this.peerConnection = new RTCPeerConnection({
                        iceServers: this.system.iceServers
                    });
                    this.system.statTracker.trackPeerConnection(`vrh${this.publisherHandle}`, `rtcStats`, this.peerConnection);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "iceCandidatesGenerated", 0);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "iceCandidatesSent", 0);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.iceGatheringState", this.peerConnection.iceGatheringState);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.iceConnectionState", this.peerConnection.iceConnectionState);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.connectionState", this.peerConnection.connectionState);
                    this.peerConnection.addEventListener("icecandidate", this.pc_onIceCandidate.bind(this));
                    this.peerConnection.addEventListener("icegatheringstatechange", this.pc_onIceGatheringStateChange.bind(this));
                    this.peerConnection.addEventListener("iceconnectionstatechange", this.pc_onIceConnectionStateChange.bind(this));
                    this.peerConnection.addEventListener("connectionstatechange", this.pc_onConnectionStateChange.bind(this));
                    this.peerConnection.addEventListener("negotiationneeded", this.pc_onNegotiationNeeded.bind(this));
                    // no ontrack event for local media - 'track' is only fired for remote webrtc tracks.
                    this.system.setPeerConnectionForHandle(this.publisherHandle, this.peerConnection);
                    this.localMediaStream = new MediaStream();
                    let trackChangeHandler = this.updateAudioVideoEnabledStates.bind(this);
                    this.localMediaStream.addEventListener("addtrack", trackChangeHandler);
                    this.localMediaStream.addEventListener("removetrack", trackChangeHandler);
                    // create the element
                    this.mediaFactoryContext = this.system.localMediaFactory.create({
                        peerConnection: this.peerConnection,
                        mediaStream: this.localMediaStream,
                        component: this.component
                    });
                    this.mediaFactoryWasInitialized = true;
                    // warm up the local media devices
                    this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.initState", "Initializing...");
                    try {
                        yield this.system.userMediaFactory.initializeUserMediaAsync({
                            initAudio: this.system.localAudioEnabled,
                            initVideo: this.system.localVideoEnabled
                        });
                        this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.initState", "Initialized.");
                    } catch (e) {
                        console.error(`[WebRTC] userMediaFactory threw error in initializeUserMediaAsync. This may cause unpredictable results with WebRTC calls.`, e);
                        this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.initState", "Failed");
                        throw e;
                    }
                    // add the media to our peerconnection
                    this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.acquisitionState", "Acquiring...");
                    try {
                        let tracks = yield this.system.userMediaFactory.getCurrentMediaAsync();
                        this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.totalTracksAcquired", tracks.length);
                        for (let track of tracks){
                            this.system.statTracker.set(`Controller ${this.node.id}`, `localTracks.${track.id}`, `Adding [${track.kind}] ${track.label}]`);
                            this.localMediaStream.addTrack(track);
                            this.peerConnection.addTrack(track, this.localMediaStream);
                            this.system.statTracker.set(`Controller ${this.node.id}`, `localTracks.${track.id}`, `[${track.kind}] ${track.label}]`);
                        }
                        this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.acquisitionState", "Complete");
                    } catch (e1) {
                        console.error(`[WebRTC] userMediaFactory threw error in getCurrentMediaAsync. This may cause unpredictable results with WebRTC calls.`, e1);
                        this.system.statTracker.set(`Controller ${this.node.id}`, "userMedia.acquisitionState", "Failed");
                    }
                    this.updateAudioVideoEnabledStates();
                // don't start the connection here: it gets started automatically by the 'negotiationneeded' event
                // todo: what if it doesn't?
                });
            }
            destroyPeerConnectionAsync(ct) {
                return __awaiter(this, void 0, void 0, function*() {
                    ct = NodeComponentModel.CancellationTokenSource.ensure(ct);
                    try {
                        this.system.localMediaFactory.destroy({
                            peerConnection: this.peerConnection,
                            mediaStream: this.localMediaStream,
                            context: this.mediaFactoryContext,
                            component: this.component
                        });
                        this.mediaFactoryWasInitialized = false;
                    } catch (e) {
                        console.error(`[WebRTC] localMediaFactory.destroy threw an error`, {
                            originalError: e
                        });
                    }
                    if (this.peerConnection) this.peerConnection.close();
                    this.system.statTracker.untrackPeerConnection(this.peerConnection);
                    this.peerConnection = null;
                    this.mediaFactoryContext = null;
                    if (this.localMediaStream) {
                        try {
                            for (let track of this.localMediaStream.getTracks())try {
                                track.enabled = false;
                                track.stop();
                                this.localMediaStream.removeTrack(track);
                            } catch (e1) {
                                console.error(`[WebRTC] Failed to stop/remove track from localMediaStream`, {
                                    stream: this.localMediaStream,
                                    track: track,
                                    error: e1
                                });
                            }
                        } catch (e2) {
                            console.error(`[WebRTC] Failed to remove tracks from localMediaStream`, {
                                localMediaStream: this.localMediaStream,
                                error: e2
                            });
                        }
                        try {
                            if (typeof this.localMediaStream["stop"] === "function") this.localMediaStream["stop"]();
                            else console.log(`[WebRTC] This browser does not have a 'stop' function on MediaStream (attempting to stop localMediaStream)`);
                        } catch (e3) {
                            console.error(`[WebRTC] Failed to stop localMediaStream`);
                        }
                        this.localMediaStream = null;
                    }
                });
            }
            // VERTX events
            component_onComponentChanged(baseComponent) {
                let component = baseComponent;
                try {
                    this.updateAudioVideoEnabledStates();
                } catch (e) {
                    this.logErrors(e);
                }
            }
            sessionObserver_onWebRtcUp(sender, message) {
                if (message.sender == this.system.getVideoRoomPublishHandle()) {
                    console.log("[WebRTC] WebRTC is now up! (media sending successful)", message);
                    this.isWebRtcUp = true;
                    this.updatePublishingState();
                }
            }
            system_localPublisherIdChanged(sender, publisherId) {
                console.debug(`[WebRTC] Our Publish ID is now ${publisherId}`);
                this.publisherId = publisherId;
                this.updatePublishingState();
            }
            // peerconnection events
            pc_onIceCandidate(evt) {
                return __awaiter(this, void 0, void 0, function*() {
                    assert(this.publisherHandle, "publisherHandle is not set (ice candidate ready)");
                    let candidate = evt.candidate;
                    let handle = this.publisherHandle;
                    if (candidate) {
                        this.system.statTracker.increment(`vrh${this.publisherHandle}`, "iceCandidatesGenerated");
                        yield this.system.sendIce(handle, candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate);
                        this.system.statTracker.increment(`vrh${this.publisherHandle}`, "iceCandidatesSent");
                    } else {
                        this.system.statTracker.set(`vrh${this.publisherHandle}`, "iceCandidates.complete", "Sending");
                        yield this.system.sendIceComplete(handle);
                        this.system.statTracker.set(`vrh${this.publisherHandle}`, "iceCandidates.complete", "Sent");
                    }
                });
            }
            pc_onIceGatheringStateChange(evt) {
                this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.iceGatheringState", this.peerConnection.iceGatheringState);
            }
            pc_onIceConnectionStateChange(evt) {
                this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.iceConnectionState", this.peerConnection.iceConnectionState);
            }
            pc_onConnectionStateChange(evt) {
                this.system.statTracker.set(`vrh${this.publisherHandle}`, "pcStatus.connectionState", this.peerConnection.connectionState);
            }
            pc_onNegotiationNeeded(evt) {
                return __awaiter(this, void 0, void 0, function*() {
                    console.log("[WebRTC] PeerConnection needs negotiation", {
                        event: evt,
                        peerConnection: evt.currentTarget
                    });
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "peerConnection", "CreatingOffer");
                    let offer = yield this.peerConnection.createOffer();
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "peerConnection", "SettingLocalDesc");
                    yield this.peerConnection.setLocalDescription(offer);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "peerConnection", "MakingOffer");
                    yield this.system.sendJsep(this.publisherHandle, offer.type, offer.sdp);
                    this.system.statTracker.set(`vrh${this.publisherHandle}`, "peerConnection", "SentOffer");
                });
            }
            // utils
            logErrors(error) {
                console.error(`A promise faulted in WebRtcComponentView`, error);
            }
        }
        NodeComponentModel.WebRtcComponentController2 = WebRtcComponentController2;
        // internal classes
        class WebRtcViewSubscriptionInfo {
            constructor(publisherId, view, mediaFactory){
                this.cts = new NodeComponentModel.CancellationTokenSource();
                this.cts.register(this.onCancelled.bind(this));
                this.publisherId = publisherId;
                this.view = view;
                this.mediaFactory = mediaFactory;
            }
            // convenience properties
            get component() {
                return this.view.component;
            }
            get node() {
                return this.view.node;
            }
            get system() {
                return this.view.system;
            }
            initAsync() {
                return __awaiter(this, void 0, void 0, function*() {
                    // publisherId is immutable within this class, so if we know it's invalid, we know we
                    // don't need to do any more setup
                    if (!this.publisherId) return;
                    assert(this.mediaFactory, "no mediaFactory was provided");
                    yield Promise.race([
                        this.system.isInitializedAsyncTask(),
                        this.cts.promise()
                    ]);
                    if (this.cts.isCancellationRequested) return;
                    if (!this.view.isValidCall()) return;
                    this.subscriberHandle = yield this.view.subscriberHandle;
                    // construct the html view
                    // equivalent of 'instantiate the prefab' in unity
                    [this.peerConnection, this.mediaStream] = this.createIncomingPeerConnection();
                    // get the factory to create the media
                    this.factoryContext = this.mediaFactory.create({
                        peerConnection: this.peerConnection,
                        mediaStream: this.mediaStream,
                        component: this.component
                    });
                    // unity inits a signaler here - we have no such concept, we just send the messages
                    // directly via system.sendIce etc
                    // in view, we don't create an offer, janus sends it to us.
                    if (this.subscriberHandle != 0 && this.publisherId != 0) {
                        this.system.setPeerConnectionForHandle(this.subscriberHandle, this.peerConnection);
                        if (this.view._hasSubscribedToAny == false) {
                            this.view._hasSubscribedToAny = true;
                            yield this.system.subscribeTo(this.subscriberHandle, this.publisherId);
                        } else yield this.system.switchSubscriptionTo(this.subscriberHandle, this.publisherId);
                    }
                });
            }
            cancel() {
                this.cts.cancel();
            }
            onCancelled() {
                this.mediaFactory.destroy({
                    peerConnection: this.peerConnection,
                    mediaStream: this.mediaStream,
                    context: this.factoryContext,
                    component: this.component
                });
                this.factoryContext = null;
                this.destroyPeerConnection();
            }
            createIncomingPeerConnection() {
                this.system.statTracker.set(`View ${this.node.id}`, "vrHandle", this.subscriberHandle);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "node.id", this.node.id);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "node.kind", "view/receiver");
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "peerConnection", "creating...");
                //this.system.statTracker.set(`vrh${this.subscriberHandle}`, "turnServers", "todo");
                let peerConnection = new RTCPeerConnection({
                    iceServers: this.system.iceServers
                });
                this.system.statTracker.trackPeerConnection(`vrh${this.subscriberHandle}`, "rtcStats", peerConnection);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "iceCandidatesGenerated", 0);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "iceCandidatesSent", 0);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.iceGatheringState", peerConnection.iceGatheringState);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.iceConnectionState", peerConnection.iceConnectionState);
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.connectionState", peerConnection.connectionState);
                peerConnection.addEventListener("icecandidate", this.pc_onIceCandidate.bind(this));
                // todo: unbind?
                peerConnection.addEventListener("icegatheringstatechange", (evt)=>{
                    this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.iceGatheringState", peerConnection.iceGatheringState);
                });
                peerConnection.addEventListener("iceconnectionstatechange", (evt)=>{
                    this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.iceGatheringState", peerConnection.iceGatheringState);
                });
                peerConnection.addEventListener("connectionstatechange", (evt)=>{
                    this.system.statTracker.set(`vrh${this.subscriberHandle}`, "pcStatus.iceGatheringState", peerConnection.iceGatheringState);
                });
                peerConnection.addEventListener("track", this.pc_onTrack.bind(this));
                // this might not be the best way of doing this (we are blindly bundling all webrtc tracks
                // from the peerconnection into one stream. In some advanced scenarios, this might not be the best idea.)
                let mediaStream = new MediaStream();
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, "peerConnection", "Created");
                return [
                    peerConnection,
                    mediaStream
                ];
            }
            destroyPeerConnection() {
                if (this.mediaStream) {
                    for (let track of this.mediaStream.getTracks()){
                        track.enabled = false;
                        track.stop();
                        this.mediaStream.removeTrack(track);
                    }
                    if (typeof this.mediaStream["stop"] === "function") this.mediaStream["stop"]();
                    this.mediaStream = null;
                }
                if (this.peerConnection) {
                    this.peerConnection.close();
                    this.system.statTracker.untrackPeerConnection(this.peerConnection);
                    this.peerConnection = null;
                }
            }
            pc_onIceCandidate(evt) {
                return __awaiter(this, void 0, void 0, function*() {
                    assert(this.subscriberHandle, "subscriberHandle is not set (ice candidate ready)");
                    let candidate = evt.candidate;
                    let handle = this.subscriberHandle;
                    if (candidate) {
                        this.system.statTracker.increment(`vrh${this.subscriberHandle}`, "iceCandidatesGenerated");
                        yield this.system.sendIce(handle, candidate.sdpMid, candidate.sdpMLineIndex, candidate.candidate);
                        this.system.statTracker.increment(`vrh${this.subscriberHandle}`, "iceCandidatesSent");
                    } else {
                        this.system.statTracker.set(`vrh${this.subscriberHandle}`, "iceCandidates.complete", "Sending");
                        yield this.system.sendIceComplete(handle);
                        this.system.statTracker.set(`vrh${this.subscriberHandle}`, "iceCandidates.complete", "Sent");
                    }
                });
            }
            pc_onTrack(evt) {
                assert(this.mediaStream, "mediaStream is not ready (ontrack)");
                this.system.statTracker.set(`vrh${this.subscriberHandle}`, `remote_${evt.track.id}`, `[${evt.track.kind}/${evt.track.enabled}] ${evt.track.label}`);
                this.mediaStream.addTrack(evt.track);
            // fun fact: there is no 'removetrack' in webrtc, they only get disabled.
            }
        }
    })(NodeComponentModel = Vertex.NodeComponentModel || (Vertex.NodeComponentModel = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let UI;
    (function(UI) {
        class InspectorPanel {
            constructor(){
                this.showObjects = false;
                this.arrayBreakout = 4;
                this.excludedProperties = new Array();
                this.customRenderers = new Map();
                this.onInputChanged = new Vertex.EventBus();
                this.wasModified = false;
            }
            propertyRenderer(propertyName, renderer) {
                this.customRenderers.set(propertyName, renderer);
            }
            excludeProperty(propertyName) {
                this.excludedProperties.push(propertyName);
            }
            handleInputChangedEvent(evt) {
                this.onInputChanged.trigger(evt);
                this.wasModified = true;
            }
            bind(targetElement, target) {
                this.targetElement = targetElement;
                this.targetElement.innerHTML = "";
                this.target = target;
                if (this.title) this.renderTitleBar(this.title);
                for(var property in this.target){
                    let renderMethod = this.renderDataRow.bind(this);
                    if (this.customRenderers.has(property)) {
                        let customRenderer = this.customRenderers.get(property);
                        renderMethod = customRenderer.RenderProperty.bind(customRenderer);
                    }
                    var dataRow = renderMethod(property, target);
                    if (dataRow) this.targetElement.appendChild(dataRow);
                }
            }
            renderTitleBar(title) {
                var row = document.createElement("div");
                row.classList.add("row", "control-heading", "control-heading-pin-top");
                var titleElement = document.createElement("div");
                titleElement.classList.add("col", "pl-1");
                titleElement.innerText = title;
                row.appendChild(titleElement);
                let deleteBtn = document.createElement("div");
                deleteBtn.classList.add("inspector-delete-btn");
                deleteBtn.innerHTML = "&times;";
                deleteBtn.title = "Remove Component";
                let self = this;
                deleteBtn.addEventListener("click", ()=>{
                    let component = self.target;
                    if ("name" in component == false) {
                        console.error("Delete Component was invoked, but the inspector target did not seem to be a component.");
                        return;
                    }
                    if (!this.targetNode) {
                        console.error("Delete Component was invoked, but the inspector does not have a targetNode assigned.");
                        return;
                    }
                    this.targetNode.removeComponent(component.name);
                    console.log(`Removed '${component.name} component from node.`);
                    Vertex.Globals.event.fire("editor:selectNode", this.targetNode);
                });
                row.appendChild(deleteBtn);
                this.targetElement.appendChild(row);
            }
            renderDataRow(property, currentTarget) {
                if (this.excludedProperties.indexOf(property) !== -1) return;
                var propertyValue = currentTarget[property];
                if (propertyValue === null || typeof propertyValue === "undefined") return;
                if (propertyValue.toString().startsWith("[object Object]") && this.showObjects === false) {
                    if (propertyValue instanceof Vertex.NodeComponentModel.Structure) {
                        let dataRow = document.createElement("div");
                        dataRow.classList.add("row", "control-group");
                        dataRow.classList.add("row", "m-1");
                        dataRow.style.backgroundColor = "#171718";
                        dataRow.dataset["vtxBinding"] = currentTarget.name + "." + property;
                        let label = document.createElement("div");
                        label.classList.add("col-12", "control-heading");
                        label.style.textAlign = "left";
                        label.innerText = property;
                        let value = document.createElement("div");
                        value.classList.add("col-12", "inspector-control-section");
                        propertyValue["name"] = property;
                        propertyValue["_isStructure"] = true;
                        let nestedInspector = new InspectorPanel();
                        nestedInspector.arrayBreakout = 0;
                        nestedInspector.excludedProperties.push("name");
                        nestedInspector.excludedProperties.push("_isStructure");
                        nestedInspector.bind(value, propertyValue);
                        let self = this;
                        nestedInspector.onInputChanged.on((evt)=>{
                            let targetInput = evt.target;
                            let vtxBindingData = evt.target["dataset"]["vtxBinding"];
                            console.log(vtxBindingData);
                            if (vtxBindingData && vtxBindingData.startsWith(property)) {
                                let splitString = vtxBindingData;
                                splitString = splitString.split(".")[1];
                                typeof propertyValue[splitString];
                                if (typeof propertyValue[splitString] === "number") propertyValue[splitString] = targetInput.valueAsNumber;
                                else if (typeof propertyValue[splitString] === "string") propertyValue[splitString] = "" + targetInput.value;
                                else propertyValue[splitString] = "" + targetInput.value;
                            }
                            //nasty little jam to make this work with the node inspector, this could cause us issues later [ld] HACK HACK HACK
                            self.handleInputChangedEvent({
                                srcElement: dataRow,
                                target: dataRow,
                                getAttribute: function(e) {
                                    return currentTarget.name + "." + property;
                                }
                            });
                        });
                        dataRow.appendChild(label);
                        dataRow.appendChild(value);
                        return dataRow;
                    } else return;
                }
                let dataRow1 = document.createElement("div");
                dataRow1.classList.add("row", "control-group");
                let isArray = Array.isArray(propertyValue);
                var label1 = document.createElement("div");
                label1.classList.add("col-3", "control-label");
                label1.innerText = property;
                if (isArray) {
                    let self1 = this;
                    label1.style.cursor = "pointer";
                    label1.title = "Click to Set Array Size";
                    label1.addEventListener("click", (evt)=>{
                        let controlValue = document.createElement("div");
                        controlValue.classList.add("control-value");
                        controlValue.style.position = "fixed";
                        controlValue.style.left = evt.clientX - 40 + "px";
                        controlValue.style.top = evt.clientY - 20 + "px";
                        controlValue.style.width = "80px";
                        let input = this.renderInputField("", "number");
                        input.placeholder = "Array Length";
                        let changeArrSizeFunc = function(newSize) {
                            if (typeof newSize !== "number") {
                                console.warn("Array Size was not a number");
                                return;
                            }
                            if (isNaN(newSize)) {
                                console.warn("Array Size was NaN, not setting.");
                                return;
                            }
                            if (newSize < 0) {
                                console.warn("Not setting array size less than 0");
                                return;
                            }
                            if (newSize > 32) {
                                console.warn("Not setting array size greater than 32");
                                return;
                            }
                            // hall-of-mirrors level reflection going on here...
                            // Pass in a false bson writer object and wait to see which
                            //  writer method it calls for the property to determine the correct type.
                            let typePromise = new Promise((resolve, reject)=>{
                                let bsonWriterMethod = currentTarget.writeDataBSON;
                                if (typeof bsonWriterMethod !== "function") throw "BSON Writer not found";
                                let _currentType = null;
                                var bsonWriterFacade = {
                                    startObject: ()=>{},
                                    endObject: ()=>{
                                        if (_currentType != null) resolve(_currentType);
                                        else reject();
                                    },
                                    writeInt16: ()=>{
                                        return "number";
                                    },
                                    writeInt32: ()=>{
                                        return "number";
                                    },
                                    writeInt64: ()=>{
                                        return "number";
                                    },
                                    writeUInt16: ()=>{
                                        return "number";
                                    },
                                    writeUInt32: ()=>{
                                        return "number";
                                    },
                                    writeUInt64: ()=>{
                                        return "number";
                                    },
                                    writeSingle: ()=>{
                                        return "number";
                                    },
                                    writeDouble: ()=>{
                                        return "number";
                                    },
                                    writeString: ()=>{
                                        return "string";
                                    },
                                    writeBoolean: ()=>{
                                        return "boolean";
                                    },
                                    writeArray: (name, _, action)=>{
                                        if (name.toLowerCase() === property.toLowerCase()) _currentType = action();
                                    }
                                };
                                bsonWriterMethod.call(currentTarget, bsonWriterFacade);
                                // if we dont get a result in 300ms, it's probably failed.
                                window.setTimeout(reject, 300);
                            });
                            typePromise.then((type)=>{
                                // populate the array with default type
                                console.log("Array type is", type);
                                let oldSize = currentTarget[property].length;
                                currentTarget[property] = currentTarget[property].slice(0, newSize);
                                for(let i = oldSize; i < newSize; ++i)currentTarget[property][i] = defaultValueFor(type);
                                currentTarget.triggerOnChanged();
                                Vertex.Globals.event.fire("editor:clearSelection");
                                Vertex.Globals.event.fire("editor:selectNode", self1.targetNode);
                            }).catch((error)=>{
                                console.warn("Cannot determine array type", error);
                            });
                        };
                        let defaultValueFor = function(type) {
                            switch(type){
                                case "number":
                                    return 0;
                                case "boolean":
                                    return false;
                                default:
                                    return "";
                            }
                        };
                        input.addEventListener("blur", (evt)=>{
                            if (controlValue.parentNode && controlValue) controlValue.parentNode.removeChild(controlValue);
                        });
                        input.addEventListener("keyup", (evt)=>{
                            switch(evt.key){
                                case "Escape":
                                    // cancel
                                    input.blur();
                                    break;
                                case "Enter":
                                    // set new value
                                    let newLength = +input.value;
                                    changeArrSizeFunc(newLength);
                                    input.blur();
                                    break;
                                default:
                                    break;
                            }
                        });
                        controlValue.appendChild(input);
                        dataRow1.appendChild(controlValue);
                        input.focus();
                    });
                }
                dataRow1.appendChild(label1);
                var value1 = document.createElement("div");
                value1.classList.add("col", "control-value");
                var input = null;
                if (!isArray) {
                    input = this.renderInputField(propertyValue, typeof currentTarget[property]);
                    input.setAttribute("data-vtx-binding", currentTarget.name + "." + property);
                    input.addEventListener("change", this.handleInputChangedEvent.bind(this));
                    value1.appendChild(input);
                } else if (propertyValue.length <= this.arrayBreakout) {
                    var idx = 0;
                    for (var val of propertyValue){
                        input = this.renderInputField(val, typeof currentTarget[property][idx]);
                        input.setAttribute("data-vtx-binding", currentTarget.name + "." + property + "." + idx);
                        input.setAttribute("data-vtx-array", idx.toString());
                        input.addEventListener("change", this.handleInputChangedEvent.bind(this));
                        value1.appendChild(input);
                        idx++;
                    }
                } else {
                    input = this.renderInputField(propertyValue, typeof currentTarget[property]);
                    input.setAttribute("data-vtx-binding", currentTarget.name + "." + property);
                    input.addEventListener("change", this.handleInputChangedEvent.bind(this));
                    value1.appendChild(input);
                }
                dataRow1.appendChild(value1);
                return dataRow1;
            }
            renderInputField(value, type) {
                if (type === "boolean") {
                    var list = document.createElement("select");
                    list.classList.add("form-control");
                    var trueOption = document.createElement("option");
                    trueOption.value = "true";
                    trueOption.innerText = "True";
                    trueOption.selected = !!value;
                    var falseOption = document.createElement("option");
                    falseOption.value = "false";
                    falseOption.innerText = "False";
                    falseOption.selected = !value;
                    list.appendChild(trueOption);
                    list.appendChild(falseOption);
                    return list;
                } else {
                    var input = document.createElement("input");
                    input.classList.add("form-control");
                    input.autocomplete = "off";
                    input.value = value;
                    input.type = "text";
                    if (typeof value === "number") {
                        input.type = "number";
                        if (value !== 0) input.value = value.toPrecision(4);
                    }
                    input.spellcheck = false;
                    return input;
                }
            }
        }
        UI.InspectorPanel = InspectorPanel;
    })(UI = Vertex.UI || (Vertex.UI = {}));
})(Vertex || (Vertex = {}));
var Vertex;
(function(Vertex) {
    let UI;
    (function(UI) {
        class ScrollFlex {
            constructor(){
                let scrollingDiv = document.createElement("span");
                scrollingDiv.classList.add("scrollFlex");
                let isDown = false;
                let startX;
                let scrollLeft;
                scrollingDiv.addEventListener("mousedown", (e)=>{
                    e.preventDefault();
                    isDown = true;
                    scrollingDiv.classList.add("active");
                    startX = e.pageX - scrollingDiv.offsetLeft;
                    scrollLeft = scrollingDiv.scrollLeft;
                });
                document.addEventListener("mouseup", (e)=>{
                    if (isDown) {
                        e.stopPropagation();
                        e.preventDefault();
                        isDown = false;
                        scrollingDiv.classList.remove("active");
                    }
                });
                document.addEventListener("mousemove", (e)=>{
                    e.stopPropagation();
                    if (!isDown) return;
                    e.preventDefault();
                    const x = e.pageX - scrollingDiv.offsetLeft;
                    const walk = (x - startX) * 3;
                    scrollingDiv.scrollLeft = scrollLeft - walk;
                });
                scrollingDiv.addEventListener("drag", (e)=>{
                    e.stopPropagation();
                });
                this.scrollingDiv = scrollingDiv;
            }
        }
        UI.ScrollFlex = ScrollFlex;
    })(UI = Vertex.UI || (Vertex.UI = {}));
})(Vertex || (Vertex = {})); //# sourceMappingURL=vertexruntime.js.map

//# sourceMappingURL=index.da9e0195.js.map
