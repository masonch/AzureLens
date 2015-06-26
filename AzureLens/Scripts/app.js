// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
///<reference path="typings/babylon.2.1.d.ts" />
///<reference path="typings/waa.d.ts" />
///<reference path="typings/jquery/jquery.d.ts" />
var BoxData = (function () {
    function BoxData() {
    }
    return BoxData;
})();
var CylinderData = (function () {
    function CylinderData() {
    }
    return CylinderData;
})();
var ObjectData = (function () {
    function ObjectData() {
    }
    return ObjectData;
})();
var ARROW_TYPE;
(function (ARROW_TYPE) {
    ARROW_TYPE[ARROW_TYPE["Simple"] = 0] = "Simple";
    ARROW_TYPE[ARROW_TYPE["ArrowTip"] = 1] = "ArrowTip";
    ARROW_TYPE[ARROW_TYPE["ArrowTipBothEnds"] = 2] = "ArrowTipBothEnds";
})(ARROW_TYPE || (ARROW_TYPE = {}));
var BOX2D_TYPE;
(function (BOX2D_TYPE) {
    BOX2D_TYPE[BOX2D_TYPE["BorderOnly"] = 0] = "BorderOnly";
    BOX2D_TYPE[BOX2D_TYPE["Filled"] = 1] = "Filled";
})(BOX2D_TYPE || (BOX2D_TYPE = {}));
var BOX_TYPE;
(function (BOX_TYPE) {
    BOX_TYPE[BOX_TYPE["VM"] = 0] = "VM";
    BOX_TYPE[BOX_TYPE["WebSite"] = 1] = "WebSite";
    BOX_TYPE[BOX_TYPE["O365"] = 2] = "O365";
    BOX_TYPE[BOX_TYPE["GitRepo"] = 3] = "GitRepo";
    BOX_TYPE[BOX_TYPE["GitHub"] = 4] = "GitHub";
    BOX_TYPE[BOX_TYPE["VSO"] = 5] = "VSO";
    BOX_TYPE[BOX_TYPE["MachineLearning"] = 6] = "MachineLearning";
    BOX_TYPE[BOX_TYPE["HDInsight"] = 7] = "HDInsight";
    BOX_TYPE[BOX_TYPE["StreamAnalytics"] = 8] = "StreamAnalytics";
    BOX_TYPE[BOX_TYPE["EventHubs"] = 9] = "EventHubs";
})(BOX_TYPE || (BOX_TYPE = {}));
var LOWBOX_TYPE;
(function (LOWBOX_TYPE) {
    LOWBOX_TYPE[LOWBOX_TYPE["Server"] = 0] = "Server";
})(LOWBOX_TYPE || (LOWBOX_TYPE = {}));
var TEXT_TYPE;
(function (TEXT_TYPE) {
    TEXT_TYPE[TEXT_TYPE["Flat"] = 0] = "Flat";
    TEXT_TYPE[TEXT_TYPE["Floating"] = 1] = "Floating";
})(TEXT_TYPE || (TEXT_TYPE = {}));
var IMAGE_TYPE;
(function (IMAGE_TYPE) {
    IMAGE_TYPE[IMAGE_TYPE["Flat"] = 0] = "Flat";
    IMAGE_TYPE[IMAGE_TYPE["Floating"] = 1] = "Floating";
})(IMAGE_TYPE || (IMAGE_TYPE = {}));
var CYLINDER_TYPE;
(function (CYLINDER_TYPE) {
    CYLINDER_TYPE[CYLINDER_TYPE["AzureCache"] = 0] = "AzureCache";
    CYLINDER_TYPE[CYLINDER_TYPE["AzureSQL"] = 1] = "AzureSQL";
    CYLINDER_TYPE[CYLINDER_TYPE["DocumentDB"] = 2] = "DocumentDB";
    CYLINDER_TYPE[CYLINDER_TYPE["MySQL"] = 3] = "MySQL";
    CYLINDER_TYPE[CYLINDER_TYPE["SQLDataSync"] = 4] = "SQLDataSync";
    CYLINDER_TYPE[CYLINDER_TYPE["SQLDatabase"] = 5] = "SQLDatabase";
    CYLINDER_TYPE[CYLINDER_TYPE["BlobStorage"] = 6] = "BlobStorage";
})(CYLINDER_TYPE || (CYLINDER_TYPE = {}));
var AzureLens = (function () {
    function AzureLens() {
        var _this = this;
        this.BOX_SIZE = 6;
        this.PLANE_SIZE = 600;
        this._objects = {};
        this.manualMode = false;
        this.selectedItem = null;
        this.menu = null;
        this.moving = {
            down: false,
            up: false,
            left: false,
            right: false,
            front: false,
            back: false
        };
        this.rotating = {
            down: false,
            up: false,
            left: false,
            right: false
        };
        this._objects = {};
        this._lightPoints = [];
        document.getElementById("popupExpand").addEventListener("click", function (evt) {
            _this.popupExpand(evt);
        });
        document.getElementById("expandedClose").addEventListener("click", function (evt) {
            _this.expandedClose(evt);
        });
        window.addEventListener('click', function (evt) {
            if (_this._scene != null) {
                var pickResult = _this._scene.pick(evt.clientX, evt.clientY);
                if (pickResult.hit) {
                    _this.handleObjectClick(pickResult);
                }
            }
        });
        window.addEventListener('keyup', function (evt) {
            switch (evt.keyCode) {
                case 37:
                    _this.moving.left = false;
                    break;
                case 38:
                    _this.moving.front = false;
                    break;
                case 39:
                    _this.moving.right = false;
                    break;
                case 40:
                    _this.moving.back = false;
                    break;
            }
        }, false);
        window.addEventListener('keydown', function (evt) {
            _this.manualMode = true;
            switch (evt.keyCode) {
                case 37:
                    _this.moving.left = true;
                    break;
                case 38:
                    _this.moving.front = true;
                    break;
                case 39:
                    _this.moving.right = true;
                    break;
                case 40:
                    _this.moving.back = true;
                    break;
            }
        }, false);
        window.addEventListener('mousedown', function (evt) {
            _this.manualMode = true;
        }, false);
        window.addEventListener('pointerdown', function (evt) {
            _this.manualMode = true;
        }, false);
        window.addEventListener("resize", function () {
            if (_this._canvas != null) {
                _this._canvas.width = window.innerWidth;
                _this._canvas.height = window.innerHeight;
            }
            if (_this._engine != null) {
                _this._engine.resize();
            }
            if (_this.menu != null) {
                _this.menu.multilevelpushmenu('redraw');
            }
        });
        this.menu = $('#menu');
        this.menu.visible = false;
        this.menu.multilevelpushmenu({
            direction: 'ltr',
            backItemIcon: 'fa fa-angle-left',
            groupIcon: 'fa fa-angle-right',
            collapsed: false,
            menuHeight: '100%',
            onExpandMenuStart: function () {
                _this.expandedClose(null);
            },
            onItemClick: function () {
                _this.expandedClose(null);
                _this.closePopup();
                var element = arguments[2][0];
                var anchor = element.firstElementChild;
                if (anchor.href.indexOf('#nav') > 0) {
                    //Navigation menus
                    var id = anchor.href.substr(anchor.href.indexOf('#nav') + 4, anchor.href.length - anchor.href.indexOf('#nav') - 4);
                    _this.manualMode = false;
                    var value = id;
                    _this._definition.objects.forEach(function (item) {
                        if (value == item.id) {
                            _this.navigateToMesh(item);
                        }
                    });
                    window.event.cancelBubble = true;
                }
                else if (anchor.href.indexOf('diag') > 0) {
                    //Diagram menus
                    var id = anchor.href.substr(anchor.href.indexOf('#diag') + 5, anchor.href.length - anchor.href.indexOf('#diag') - 5);
                    _this.destroyScene();
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.open("GET", "SampleModels/" + id, true);
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            _this.createScene(xmlhttp.responseText);
                        }
                    };
                    xmlhttp.send();
                }
                else if (anchor.href.indexOf('#ni') > 0) {
                    _this.notImplemented();
                }
            }
        });
    }
    AzureLens.prototype.createBasePlane = function () {
        this._basePlane = BABYLON.Mesh.CreateBox("floor", this.PLANE_SIZE, this._scene);
        this._basePlane.scaling.x = 1;
        this._basePlane.scaling.z = 1;
        this._basePlane.scaling.y = 0.001;
        this._basePlane.material = new BABYLON.StandardMaterial("texture1", this._scene);
        this._basePlane.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
        this._basePlane.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        this._basePlane.position = new BABYLON.Vector3(-100, 0, 100);
        this._basePlane.isPickable = false;
        this._basePlane.material.backFaceCulling = false;
    };
    AzureLens.prototype.navigateToMesh = function (item) {
        var height = item.height == null ? 0 : item.height;
        var position;
        var lookAt;
        if (item.position2 != null) {
            position = new BABYLON.Vector3(item.position2.x, height + 35, item.position2.y - 50);
            lookAt = new BABYLON.Vector3(item.position2.x, height, item.position2.y);
        }
        else {
            position = new BABYLON.Vector3(item.points2[0].x, height + 35, item.points2[0].y - 50);
            lookAt = new BABYLON.Vector3(item.points2[0].x, height, item.points2[0].y);
        }
        this.targetPosition = position;
        this.targetLookat = lookAt;
        this.displayPopup(item);
        this.manualMode = false;
    };
    AzureLens.prototype.color3ToHex = function (color) {
        var result = "#" + this.rgbToHex(color.r * 255) + this.rgbToHex(color.g * 255) + this.rgbToHex(color.b * 255);
        return result;
    };
    AzureLens.prototype.rgbToHex = function (n) {
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16) + "0123456789ABCDEF".charAt(n % 16);
    };
    AzureLens.prototype.createBaseBox = function () {
        var box = BABYLON.Mesh.CreateBox("box", this.BOX_SIZE, this._scene);
        box.scaling.x = 1;
        box.scaling.z = 1;
        box.scaling.y = 1;
        box.position = new BABYLON.Vector3(-100, this.PLANE_SIZE * 0.001 + this.BOX_SIZE / 2, 100);
        box.isPickable = false;
        return box;
    };
    AzureLens.prototype.createBaseCylinder = function () {
        var cylinder = BABYLON.Mesh.CreateCylinder("cylinder", this.BOX_SIZE, this.BOX_SIZE, this.BOX_SIZE, 24, 1, this._scene);
        cylinder.scaling.x = 1;
        cylinder.scaling.z = 1;
        cylinder.scaling.y = 1;
        cylinder.position = new BABYLON.Vector3(-100, this.PLANE_SIZE * 0.001 + this.BOX_SIZE / 2, 100);
        cylinder.isPickable = false;
        return cylinder;
    };
    AzureLens.prototype.setCylinder = function (cylinder, cylinderType, id) {
        var data = new CylinderData();
        cylinder.isPickable = true;
        cylinder.id = id;
        switch (cylinderType) {
            case 0 /* AzureCache */:
                data.Image = "assets/logos/Azure Cache including Redis.png";
                break;
            case 1 /* AzureSQL */:
                data.Image = "assets/logos/Azure SQL Database.png";
                break;
            case 2 /* DocumentDB */:
                data.Image = "assets/logos/DocumentDB.png";
                break;
            case 3 /* MySQL */:
                data.Image = "assets/logos/MySQL database.png";
                break;
            case 5 /* SQLDatabase */:
                data.Image = "assets/logos/SQL Database (generic).png";
                break;
            case 4 /* SQLDataSync */:
                data.Image = "assets/logos/SQL Data Sync.png";
                break;
            case 6 /* BlobStorage */:
                data.Image = "assets/logos/Storage Blob.png";
                break;
            default:
                break;
        }
        var material0 = new BABYLON.StandardMaterial("mat0", this._scene);
        material0.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material0.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
        material0.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        material0.emissiveTexture = new BABYLON.Texture(data.Image, this._scene, true, true);
        material0.emissiveTexture.uAng = Math.PI;
        material0.emissiveTexture.wAng = Math.PI;
        material0.emissiveTexture.vAng = Math.PI;
        material0.emissiveTexture.getAlphaFromRGB = true;
        material0.emissiveTexture.hasAlpha = true;
        material0.emissiveTexture.uScale = 3.5;
        material0.emissiveTexture.uOffset = 0.77;
        material0.emissiveTexture.vOffset = 0.1;
        material0.emissiveTexture.vScale = 1.1;
        material0.useAlphaFromDiffuseTexture = false;
        var material1 = new BABYLON.StandardMaterial("mat1", this._scene);
        material1.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material1.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
        var multimat = new BABYLON.MultiMaterial("multi", this._scene);
        multimat.subMaterials.push(material0);
        multimat.subMaterials.push(material1);
        cylinder.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI * 0.75, BABYLON.Space.LOCAL);
        cylinder.material = multimat;
        cylinder.subMeshes = [];
        var verticesCount = cylinder.getTotalVertices();
        cylinder.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 36, 232, cylinder));
        cylinder.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 36, cylinder));
    };
    AzureLens.prototype.createCylinder = function (id, cylinderType, position) {
        var cylinder = this.createBaseCylinder();
        this.setCylinder(cylinder, cylinderType, id);
        cylinder.position.x = position.x;
        cylinder.position.z = position.y;
        var o = new ObjectData();
        o.ID = id;
        o.Type = "CYLINDER_TYPE." + CYLINDER_TYPE[cylinderType].toString();
        o.Meshes = [cylinder];
        if (this._objects[id] == null)
            this._objects[id] = o;
        else
            throw "Two objects with the same id '" + id + "' are defined.";
    };
    AzureLens.prototype.createLowBox = function (id, lowboxType, position) {
        var box = this.createBaseBox();
        this.setLowBox(box, lowboxType, id);
        box.scaling.y = 1 / 3;
        box.position.y = this.PLANE_SIZE * 0.001 + this.BOX_SIZE / 6;
        box.position.x = position.x;
        box.position.z = position.y;
        var o = new ObjectData();
        o.ID = id;
        o.Type = "LOWBOX_TYPE." + LOWBOX_TYPE[lowboxType].toString();
        o.Meshes = [box];
        if (this._objects[id] == null)
            this._objects[id] = o;
        else
            throw "Two objects with the same id '" + id + "' are defined.";
    };
    AzureLens.prototype.setLowBox = function (box, lowboxType, id) {
        var data = new BoxData();
        box.isPickable = true;
        box.id = id;
        switch (lowboxType) {
            case 0 /* Server */:
                data.Image = "assets/logos/CustomServer.png";
                break;
            default:
                break;
        }
        var material0 = new BABYLON.StandardMaterial("mat0", this._scene);
        material0.diffuseColor = new BABYLON.Color3(1, 1, 1);
        material0.diffuseTexture = new BABYLON.Texture(data.Image, this._scene);
        material0.diffuseTexture.wAng = Math.PI;
        material0.diffuseTexture.getAlphaFromRGB = true;
        material0.diffuseTexture.hasAlpha = true;
        material0.diffuseTexture.uScale = 1;
        material0.diffuseTexture.vScale = 1;
        material0.bumpTexture = new BABYLON.Texture(data.Image, this._scene);
        material0.bumpTexture.wAng = Math.PI;
        material0.bumpTexture.uScale = 1;
        material0.bumpTexture.vScale = 1;
        var material1 = new BABYLON.StandardMaterial("mat1", this._scene);
        material1.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        var multimat = new BABYLON.MultiMaterial("multi", this._scene);
        multimat.subMaterials.push(material0);
        multimat.subMaterials.push(material1);
        box.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.LOCAL);
        box.material = multimat;
        box.subMeshes = [];
        var verticesCount = box.getTotalVertices();
        box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
        box.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 6, 30, box));
    };
    AzureLens.prototype.createBox = function (id, boxType, position) {
        var box = this.createBaseBox();
        this.setBox(box, boxType, id);
        box.position.x = position.x;
        box.position.z = position.y;
        var o = new ObjectData();
        o.ID = id;
        o.Type = "BOX_TYPE." + BOX_TYPE[boxType].toString();
        o.Meshes = [box];
        if (this._objects[id] == null)
            this._objects[id] = o;
        else
            throw "Two objects with the same id '" + id + "' are defined.";
    };
    AzureLens.prototype.setBox = function (box, boxType, id) {
        var data = new BoxData();
        box.isPickable = true;
        box.id = id;
        switch (boxType) {
            case 0 /* VM */:
                data.Image = "assets/logos/VM symbol only.png";
                break;
            case 1 /* WebSite */:
                data.Image = "assets/logos/Azure Websites.png";
                break;
            case 2 /* O365 */:
                data.Image = "assets/logos/Office 365.png";
                break;
            case 3 /* GitRepo */:
                data.Image = "assets/logos/Git repository.png";
                break;
            case 4 /* GitHub */:
                data.Image = "assets/logos/GitHub.png";
                break;
            case 5 /* VSO */:
                data.Image = "assets/logos/Visual Studio Online.png";
                break;
            case 6 /* MachineLearning */:
                data.Image = "assets/logos/Machine Learning.png";
                break;
            case 7 /* HDInsight */:
                data.Image = "assets/logos/HDInsight.png";
                break;
            case 8 /* StreamAnalytics */:
                data.Image = "assets/logos/Stream Analytics.png";
                break;
            case 9 /* EventHubs */:
                data.Image = "assets/logos/Event Hubs.png";
                break;
            default:
                break;
        }
        var material0 = new BABYLON.StandardMaterial("mat0", this._scene);
        material0.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        material0.emissiveTexture = new BABYLON.Texture(data.Image, this._scene);
        material0.emissiveTexture.wAng = Math.PI;
        material0.emissiveTexture.getAlphaFromRGB = true;
        material0.emissiveTexture.hasAlpha = true;
        material0.emissiveTexture.uScale = 1;
        material0.emissiveTexture.vScale = 1;
        material0.useAlphaFromDiffuseTexture = false;
        var material1 = new BABYLON.StandardMaterial("mat1", this._scene);
        material1.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        var multimat = new BABYLON.MultiMaterial("multi", this._scene);
        multimat.subMaterials.push(material0);
        multimat.subMaterials.push(material1);
        box.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.LOCAL);
        box.material = multimat;
        box.subMeshes = [];
        var verticesCount = box.getTotalVertices();
        box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
        box.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 6, 30, box));
    };
    AzureLens.prototype.drawArrow = function (id, arrowType, points, color) {
        var point1 = points[0];
        var meshes = [];
        for (var count = 1; count < points.length; count++) {
            var backgroundColor = new BABYLON.Color3(color.r, color.g, color.b);
            var point2 = points[count];
            var point3 = point1.add(point2).multiplyByFloats(0.5, 0.5);
            var arrow = BABYLON.Mesh.CreateBox("arrow", this.BOX_SIZE, this._scene);
            arrow.scaling.x = point1.subtract(point2).length() / this.BOX_SIZE;
            arrow.scaling.z = 0.05;
            arrow.scaling.y = 0.001;
            var angle = -Math.atan2(point1.y - point2.y, point1.x - point2.x) + Math.PI / 2;
            arrow.position = new BABYLON.Vector3(point3.x, this.PLANE_SIZE * 0.001 + 0.11, point3.y);
            arrow.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI / 2 + angle, BABYLON.Space.LOCAL);
            arrow.material = new BABYLON.StandardMaterial("texture1", this._scene);
            arrow.material.diffuseColor = backgroundColor;
            arrow.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
            arrow.material.emissiveColor = backgroundColor;
            arrow.material.alpha = color.a;
            arrow.isPickable = true;
            arrow.id = id;
            meshes.push(arrow);
            //Draw arrow tip?
            if (count == points.length - 1 && (arrowType == 1 /* ArrowTip */ || arrowType == 2 /* ArrowTipBothEnds */)) {
                var tip = BABYLON.Mesh.CreateBox("arrow", this.BOX_SIZE, this._scene);
                tip.scaling.x = 0.2;
                tip.scaling.z = 0.2;
                tip.scaling.y = 0.001;
                angle = angle + Math.PI / 4;
                tip.position = new BABYLON.Vector3(point2.x, this.PLANE_SIZE * 0.001 + 0.11, point2.y);
                tip.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI / 2 + angle, BABYLON.Space.LOCAL);
                tip.material = new BABYLON.StandardMaterial("texture1", this._scene);
                tip.material.diffuseColor = backgroundColor;
                tip.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                tip.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
                tip.material.alpha = color.a;
                tip.isPickable = true;
                tip.id = id;
                meshes.push(tip);
            }
            //Draw arrow tip at both ends?
            if (count == points.length - 1 && arrowType == 2 /* ArrowTipBothEnds */) {
                tip = BABYLON.Mesh.CreateBox("arrow", this.BOX_SIZE, this._scene);
                tip.scaling.x = 0.2;
                tip.scaling.z = 0.2;
                tip.scaling.y = 0.001;
                tip.position = new BABYLON.Vector3(point1.x, this.PLANE_SIZE * 0.001 + 0.11, point1.y);
                tip.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI / 2 + angle, BABYLON.Space.LOCAL);
                tip.material = new BABYLON.StandardMaterial("texture1", this._scene);
                tip.material.diffuseColor = backgroundColor;
                tip.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                tip.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
                tip.material.alpha = color.a;
                tip.isPickable = true;
                tip.id = id;
                meshes.push(tip);
            }
            point1 = point2;
        }
        var o = new ObjectData();
        o.ID = id;
        o.Type = "ARROW_TYPE." + ARROW_TYPE[arrowType].toString();
        o.Meshes = meshes;
        if (this._objects[id] == null)
            this._objects[id] = o;
        else
            throw "Two objects with the same id '" + id + "' are defined.";
    };
    AzureLens.prototype.drawBox2D = function (id, box2DType, points, color) {
        switch (box2DType) {
            case 0 /* BorderOnly */:
                var points2 = [];
                //Define flat box points
                points2.push(new BABYLON.Vector2(points[0].x, points[0].y));
                points2.push(new BABYLON.Vector2(points[1].x, points[0].y));
                points2.push(new BABYLON.Vector2(points[1].x, points[1].y));
                points2.push(new BABYLON.Vector2(points[0].x, points[1].y));
                points2.push(new BABYLON.Vector2(points[0].x, points[0].y));
                var point1 = points2[0];
                var meshes = [];
                for (var count = 1; count < points2.length; count++) {
                    var point2 = points2[count];
                    var point3 = point1.add(point2).multiplyByFloats(0.5, 0.5);
                    var line = BABYLON.Mesh.CreateBox("box2d", this.BOX_SIZE, this._scene);
                    line.scaling.x = point1.subtract(point2).length() / this.BOX_SIZE;
                    line.scaling.z = 0.05;
                    line.scaling.y = 0.001;
                    var angle = -Math.atan2(point1.y - point2.y, point1.x - point2.x) + Math.PI / 2;
                    line.position = new BABYLON.Vector3(point3.x, this.PLANE_SIZE * 0.001, point3.y);
                    line.rotate(new BABYLON.Vector3(0, 1, 0), -Math.PI / 2 + angle, BABYLON.Space.LOCAL);
                    line.material = new BABYLON.StandardMaterial("texture1", this._scene);
                    line.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                    line.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                    line.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
                    line.material.alpha = color.a;
                    line.isPickable = true;
                    line.id = id;
                    meshes.push(line);
                    point1 = point2;
                }
                for (var count = 0; count < 4; count++) {
                    var corner = BABYLON.Mesh.CreateBox("box2d", this.BOX_SIZE, this._scene);
                    corner.scaling.x = 0.05;
                    corner.scaling.z = 0.05;
                    corner.scaling.y = 0.001;
                    corner.position = new BABYLON.Vector3(points2[count].x, this.PLANE_SIZE * 0.001, points2[count].y);
                    corner.material = new BABYLON.StandardMaterial("texture1", this._scene);
                    corner.material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                    corner.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                    corner.material.emissiveColor = new BABYLON.Color3(color.r, color.g, color.b);
                    corner.material.alpha = color.a;
                    corner.isPickable = true;
                    corner.id = id;
                    meshes.push(corner);
                }
                var o = new ObjectData();
                o.ID = id;
                o.Type = "BOX2D_TYPE." + BOX2D_TYPE[box2DType].toString();
                o.Meshes = meshes;
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            case 1 /* Filled */:
                var backgroundColor = new BABYLON.Color3(color.r, color.g, color.b);
                var point = points[0].add(points[1]).multiplyByFloats(0.5, 0.5);
                var box = BABYLON.Mesh.CreateBox("box2d", this.BOX_SIZE, this._scene);
                box.scaling.x = points[0].subtract(new BABYLON.Vector2(points[1].x, points[0].y)).length() / this.BOX_SIZE;
                box.scaling.z = points[0].subtract(new BABYLON.Vector2(points[0].x, points[1].y)).length() / this.BOX_SIZE;
                ;
                box.scaling.y = 0.001;
                box.position = new BABYLON.Vector3(point.x, this.PLANE_SIZE * 0.001, point.y);
                box.material = new BABYLON.StandardMaterial("texture1", this._scene);
                box.material.diffuseColor = backgroundColor;
                box.material.specularColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                box.material.emissiveColor = backgroundColor;
                box.material.alpha = color.a;
                box.isPickable = true;
                box.id = id;
                var o = new ObjectData();
                o.ID = id;
                o.Type = "BOX2D_TYPE." + BOX2D_TYPE[box2DType].toString();
                o.Meshes = [box];
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            default:
                break;
        }
    };
    AzureLens.prototype.drawImage = function (id, imageType, image, position, size, height) {
        switch (imageType) {
            case 0 /* Flat */:
                var box = this.createBaseBox();
                box.isPickable = true;
                box.id = id;
                box.position.x = position.x;
                box.position.z = position.y;
                box.position.y = this.PLANE_SIZE * 0.001;
                var material0 = new BABYLON.StandardMaterial("mat0", this._scene);
                material0.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                material0.diffuseTexture = new BABYLON.Texture(image, this._scene);
                material0.diffuseTexture.wAng = Math.PI;
                material0.diffuseTexture.getAlphaFromRGB = true;
                material0.diffuseTexture.hasAlpha = true;
                material0.diffuseTexture.uScale = 1;
                material0.diffuseTexture.vScale = 1;
                material0.emissiveTexture = material0.diffuseTexture;
                material0.specularTexture = material0.diffuseTexture;
                material0.useAlphaFromDiffuseTexture = true;
                material0.useSpecularOverAlpha = true;
                var material1 = new BABYLON.StandardMaterial("mat1", this._scene);
                material1.alpha = 0;
                var multimat = new BABYLON.MultiMaterial("multi", this._scene);
                multimat.subMaterials.push(material0);
                multimat.subMaterials.push(material1);
                box.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.LOCAL);
                box.rotate(new BABYLON.Vector3(1, 0, 0), -Math.PI / 2, BABYLON.Space.LOCAL);
                box.scaling.z = 0.0001;
                box.scaling.x = size / this.BOX_SIZE;
                box.scaling.y = size / this.BOX_SIZE;
                box.material = multimat;
                box.subMeshes = [];
                var verticesCount = box.getTotalVertices();
                box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
                box.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 6, 30, box));
                var o = new ObjectData();
                o.ID = id;
                o.Type = "IMAGE_TYPE." + IMAGE_TYPE[imageType].toString();
                o.Meshes = [box];
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            case 1 /* Floating */:
                var box = this.createBaseBox();
                box.isPickable = true;
                box.id = id;
                box.position.x = position.x;
                box.position.z = position.y;
                var material0 = new BABYLON.StandardMaterial("mat0", this._scene);
                material0.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                material0.diffuseTexture = new BABYLON.Texture(image, this._scene);
                material0.diffuseTexture.wAng = Math.PI;
                material0.diffuseTexture.getAlphaFromRGB = true;
                material0.diffuseTexture.hasAlpha = true;
                material0.diffuseTexture.uScale = 1;
                material0.diffuseTexture.vScale = 1;
                material0.emissiveTexture = material0.diffuseTexture;
                material0.specularTexture = material0.diffuseTexture;
                material0.useAlphaFromDiffuseTexture = true;
                material0.useSpecularOverAlpha = true;
                var material1 = new BABYLON.StandardMaterial("mat1", this._scene);
                material1.alpha = 0;
                var multimat = new BABYLON.MultiMaterial("multi", this._scene);
                multimat.subMaterials.push(material0);
                multimat.subMaterials.push(material1);
                box.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI, BABYLON.Space.LOCAL);
                box.scaling.z = 0.0001;
                box.scaling.x = size / this.BOX_SIZE;
                box.scaling.y = size / this.BOX_SIZE;
                box.position.y = this.PLANE_SIZE * 0.001 + box.scaling.y * this.BOX_SIZE / 2 + height;
                box.material = multimat;
                box.subMeshes = [];
                var verticesCount = box.getTotalVertices();
                box.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, box));
                box.subMeshes.push(new BABYLON.SubMesh(1, 0, verticesCount, 6, 30, box));
                box.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;
                var o = new ObjectData();
                o.ID = id;
                o.Type = "IMAGE_TYPE." + IMAGE_TYPE[imageType].toString();
                o.Meshes = [box];
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            default:
                break;
        }
    };
    AzureLens.prototype.drawText = function (id, textType, position, color, fontSize, text, fontName, height, rotate) {
        switch (textType) {
            case 0 /* Flat */:
                var box = BABYLON.Mesh.CreateBox("textbox2d", this.BOX_SIZE, this._scene);
                box.scaling.y = 0.00001;
                box.material = new BABYLON.StandardMaterial("texture1", this._scene);
                box.isPickable = false;
                box.id = id;
                var texture = new BABYLON.DynamicTexture("dynamic texture", 512, this._scene, true, BABYLON.Texture.CUBIC_MODE);
                texture.hasAlpha = true;
                texture.wAng = Math.PI / 2;
                var textureContext = texture.getContext();
                texture.canRescale = true;
                textureContext.font = "bold " + fontSize + "px " + fontName;
                var textSize = textureContext.measureText(text);
                var width = textSize.width / 80;
                if (width > box.scaling.x * this.BOX_SIZE)
                    box.scaling.x = width / this.BOX_SIZE;
                box.position = new BABYLON.Vector3(position.x + (this.BOX_SIZE * box.scaling.x) / 2, this.PLANE_SIZE * 0.001 + 0.2, position.y - (this.BOX_SIZE * box.scaling.z) / 2);
                var size = texture.getSize();
                textureContext.save();
                textureContext.fillStyle = "transparent";
                textureContext.fillRect(0, 0, size.width, size.height);
                textureContext.fillStyle = this.color3ToHex(new BABYLON.Color3(color.r, color.g, color.b));
                textureContext.globalAlpha = color.a;
                textureContext.textAlign = "left";
                textureContext.fillText(text, 0, 80, size.width);
                textureContext.restore();
                texture.update();
                box.material.diffuseTexture = texture;
                box.material.emissiveTexture = texture;
                box.material.specularTexture = texture;
                box.material.useAlphaFromDiffuseTexture = true;
                box.material.useSpecularOverAlpha = true;
                var o = new ObjectData();
                o.ID = id;
                o.Type = "TEXT_TYPE." + TEXT_TYPE[textType].toString();
                o.Meshes = [box];
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            case 1 /* Floating */:
                var box = BABYLON.Mesh.CreateBox("textbox2d", this.BOX_SIZE, this._scene);
                box.scaling.z = 0.00001;
                box.material = new BABYLON.StandardMaterial("texture1", this._scene);
                box.isPickable = false;
                box.id = id;
                var texture = new BABYLON.DynamicTexture("dynamic texture", 512, this._scene, true);
                texture.hasAlpha = true;
                var textureContext = texture.getContext();
                textureContext.font = "bold " + fontSize + "px " + fontName;
                var size = texture.getSize();
                textureContext.save();
                textureContext.fillStyle = "transparent";
                textureContext.fillRect(0, 0, size.width, size.height);
                var textSize = textureContext.measureText(text);
                var width = textSize.width / 80;
                if (width > box.scaling.x * this.BOX_SIZE)
                    box.scaling.x = width / this.BOX_SIZE;
                box.position = new BABYLON.Vector3(position.x + (this.BOX_SIZE * box.scaling.x) / 2, this.PLANE_SIZE * 0.001 + box.scaling.z / 2 + height, position.y - (this.BOX_SIZE * box.scaling.z) / 2);
                textureContext.fillStyle = this.color3ToHex(new BABYLON.Color3(color.r, color.g, color.b));
                textureContext.globalAlpha = color.a;
                textureContext.textAlign = "left";
                textureContext.fillText(text, 0, 80, size.width);
                textureContext.restore();
                texture.update();
                box.material.diffuseTexture = texture;
                box.material.emissiveTexture = texture;
                box.material.specularTexture = texture;
                box.material.useAlphaFromDiffuseTexture = true;
                box.material.useSpecularOverAlpha = true;
                if (rotate == null)
                    box.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;
                else
                    box.rotate(new BABYLON.Vector3(0, 1, 0), rotate * Math.PI / 180, BABYLON.Space.LOCAL);
                var o = new ObjectData();
                o.ID = id;
                o.Type = "TEXT_TYPE." + TEXT_TYPE[textType].toString();
                o.Meshes = [box];
                if (this._objects[id] == null)
                    this._objects[id] = o;
                else
                    throw "Two objects with the same id '" + id + "' are defined.";
                break;
            default:
                break;
        }
    };
    AzureLens.prototype.handleObjectClick = function (pickingInfo) {
        var _this = this;
        var mesh;
        mesh = pickingInfo.pickedMesh;
        if (mesh != null) {
            this._definition.objects.forEach(function (item) {
                if (item.id == mesh.id && (item.position2 != null || item.points2 != null)) {
                    _this.navigateToMesh(item);
                }
            });
        }
    };
    AzureLens.prototype.displayPopup = function (item) {
        var popupDiv = document.getElementById("popupDiv");
        var popupName = document.getElementById("popupName");
        var popupDescription = document.getElementById("popupDescription");
        if (item.description != null) {
            popupDiv.style.display = "block";
            popupName.innerText = "Name: " + item.id;
            popupDescription.innerText = item.description;
        }
        else
            popupDiv.style.display = "none";
    };
    AzureLens.prototype.notImplemented = function () {
        window.alert("This feature hasn't been implemented yet. Help us build it!");
    };
    AzureLens.prototype.closePopup = function () {
        var popupDiv = document.getElementById("popupDiv");
        popupDiv.style.display = "none";
    };
    AzureLens.prototype.popupExpand = function (evt) {
        this.closePopup();
        var expandedPopupDiv = document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "block";
        this.menu.multilevelpushmenu('collapse');
    };
    AzureLens.prototype.expandedClose = function (evt) {
        this.closePopup();
        var expandedPopupDiv = document.getElementById("expandedPopupDiv");
        expandedPopupDiv.style.display = "none";
    };
    AzureLens.prototype.destroyScene = function () {
        if (this._scene != null) {
            this._engine.dispose();
            this._scene.dispose();
            this._scene = null;
            this._definition = null;
            this._canvas = null;
            this._engine = null;
            this._camera = null;
            this._cameraHidden = null;
            this._basePlane = null;
            this._light = null;
            this._lightPoints = [];
            this._objects = {};
            this.targetPosition = null;
            this.targetLookat = null;
            this.manualMode = false;
            this.selectedItem = null;
        }
    };
    AzureLens.prototype.createScene = function (sceneData) {
        var _this = this;
        this._canvas = document.getElementById("renderCanvas");
        this._engine = new BABYLON.Engine(this._canvas, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.clearColor = new BABYLON.Color3(0, 0, 0);
        this._camera = new BABYLON.TouchCamera("Camera", new BABYLON.Vector3(-100, 10, 0), this._scene);
        this._camera.attachControl(this._canvas, true);
        this._cameraHidden = new BABYLON.TouchCamera("Camera2", new BABYLON.Vector3(-100, 10, 0), this._scene);
        this._cameraHidden.attachControl(this._canvas, true);
        this._scene.setActiveCameraByName("Camera");
        //Main light
        this._light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), this._scene);
        this._light.diffuse = new BABYLON.Color3(0.3, 0.3, 0.3);
        this._light.specular = new BABYLON.Color3(1, 1, 1);
        this._light.groundColor = new BABYLON.Color3(0, 0, 0);
        //Point lights
        var light0 = new BABYLON.PointLight("lpoint0", new BABYLON.Vector3(300, 40, 300), this._scene);
        light0.diffuse = new BABYLON.Color3(0.7, 0.7, 0.7);
        light0.specular = new BABYLON.Color3(0.9, 0.9, 0.9);
        this._lightPoints.push(light0);
        light0 = new BABYLON.PointLight("lpoint1", new BABYLON.Vector3(-500, 40, 300), this._scene);
        light0.diffuse = new BABYLON.Color3(0.7, 0.7, 0.7);
        light0.specular = new BABYLON.Color3(0.9, 0.9, 0.9);
        this._lightPoints.push(light0);
        this.createBasePlane();
        var data = JSON.parse(sceneData);
        this._definition = data;
        data.objects.forEach(function (item) {
            switch (item.type.split(".")[0]) {
                case "CYLINDER_TYPE":
                    _this.createCylinder(item.id, CYLINDER_TYPE[item.type.split(".")[1]], new BABYLON.Vector2(item.position2.x, item.position2.y));
                    break;
                case "BOX_TYPE":
                    _this.createBox(item.id, BOX_TYPE[item.type.split(".")[1]], new BABYLON.Vector2(item.position2.x, item.position2.y));
                    break;
                case "LOWBOX_TYPE":
                    _this.createLowBox(item.id, LOWBOX_TYPE[item.type.split(".")[1]], new BABYLON.Vector2(item.position2.x, item.position2.y));
                    break;
                case "ARROW_TYPE":
                    var points = [];
                    item.points2.forEach(function (p) {
                        points.push(new BABYLON.Vector2(p.x, p.y));
                    });
                    var color = new BABYLON.Color4(item.color4[0], item.color4[1], item.color4[2], item.color4[3]);
                    _this.drawArrow(item.id, ARROW_TYPE[item.type.split(".")[1]], points, color);
                    break;
                case "BOX2D_TYPE":
                    var points = [];
                    item.points2.forEach(function (p) {
                        points.push(new BABYLON.Vector2(p.x, p.y));
                    });
                    if (points.length != 2)
                        throw "2D Boxes require 2 points";
                    var color = new BABYLON.Color4(item.color4[0], item.color4[1], item.color4[2], item.color4[3]);
                    _this.drawBox2D(item.id, BOX2D_TYPE[item.type.split(".")[1]], points, color);
                    break;
                case "TEXT_TYPE":
                    var color = new BABYLON.Color4(item.color4[0], item.color4[1], item.color4[2], item.color4[3]);
                    var position = new BABYLON.Vector2(item.position2.x, item.position2.y);
                    _this.drawText(item.id, TEXT_TYPE[item.type.split(".")[1]], position, color, item.fontSize, item.text, item.fontName, item.height, item.rotate);
                    break;
                case "IMAGE_TYPE":
                    var position = new BABYLON.Vector2(item.position2.x, item.position2.y);
                    _this.drawImage(item.id, IMAGE_TYPE[item.type.split(".")[1]], item.image, position, item.size, item.height);
                    break;
                default:
                    break;
            }
        });
        var slide1 = data.objects[0];
        var height = slide1.height == null ? 0 : slide1.height;
        this.targetPosition = new BABYLON.Vector3(slide1.position2.x, height + 35, slide1.position2.y - 50);
        this.targetLookat = new BABYLON.Vector3(slide1.position2.x, height, slide1.position2.y);
        this.manualMode = false;
        //Diagrams menu
        var diagramMenu = this.menu.multilevelpushmenu('finditemsbyname', 'Diagrams').first();
        this.menu.multilevelpushmenu('removeitems', diagramMenu);
        var $addTo = this.menu.multilevelpushmenu('findmenusbytitle', 'Browse').first();
        var addItems = [{
            name: 'Diagrams',
            icon: '',
            link: '#',
            items: [
                {
                    title: 'Diagrams',
                    icon: '',
                    link: '#',
                    items: [
                    ]
                }
            ]
        }];
        addItems[0].items[0].items.unshift({
            name: "Upload your own diagram",
            icon: '',
            link: '#ni'
        });
        addItems[0].items[0].items.unshift({
            name: "How-old.Net architecture",
            icon: '',
            link: '#diagFaceDemo.json'
        });
        addItems[0].items[0].items.unshift({
            name: "AzureLens architecture",
            icon: '',
            link: '#diagAzureLens.json'
        });
        this.menu.multilevelpushmenu('additems', addItems, $addTo, 0);
        //Navigate menu
        var navigateMenu = this.menu.multilevelpushmenu('finditemsbyname', 'Navigate').first();
        this.menu.multilevelpushmenu('removeitems', navigateMenu);
        $addTo = this.menu.multilevelpushmenu('findmenusbytitle', 'AzureLens').first();
        var addItems2 = [{
            name: 'Navigate',
            icon: 'fa fa-eye',
            link: '#',
            items: [
                {
                    title: 'Navigate',
                    icon: 'fa fa-eye',
                    link: '#',
                    items: [
                    ]
                }
            ]
        }];
        data.objects.forEach(function (item) {
            if (item.pinnedToMenu == true) {
                addItems2[0].items[0].items.unshift({
                    name: item.menuName,
                    icon: '',
                    link: '#nav' + item.id
                });
            }
        });
        addItems2[0].items[0].items = addItems2[0].items[0].items.sort(function (a, b) {
            return a.name > b.name ? 1 : -1;
        });
        this.menu.multilevelpushmenu('additems', addItems2, $addTo, 3);
        this.menu.visible = true;
        this.menu.multilevelpushmenu('expand', this.menu.multilevelpushmenu('findmenusbytitle', 'Navigate').first());
        this._engine.runRenderLoop(function () {
            _this._scene.render();
            if (!_this.manualMode) {
                _this._camera.position = _this._camera.position.add(new BABYLON.Vector3((_this.targetPosition.x - _this._camera.position.x) / 50, (_this.targetPosition.y - _this._camera.position.y) / 50, (_this.targetPosition.z - _this._camera.position.z) / 50));
                _this._cameraHidden.position = _this._camera.position;
                _this._cameraHidden.setTarget(_this.targetLookat);
                var desiredRotation = _this._cameraHidden.rotation;
                _this._camera.rotation = _this._camera.rotation.add(desiredRotation.subtract(_this._camera.rotation).divide(new BABYLON.Vector3(50, 50, 50)));
                var y = _this._camera.rotation.y;
            }
            if (_this.moving.back) {
                var speed = 0.1;
                var transformationMatrix = _this._camera.getWorldMatrix();
                var direction = new BABYLON.Vector3(0, 0, -speed);
                var resultDirection = new BABYLON.Vector3(0, 0, 0);
                BABYLON.Vector3.TransformNormalToRef(direction, transformationMatrix, resultDirection);
                _this._camera.cameraDirection.addInPlace(resultDirection);
                var camera;
                camera = _this._camera;
                camera._offsetX = 0.000001;
            }
            else if (_this.moving.front) {
                var speed = 0.1;
                var transformationMatrix = _this._camera.getWorldMatrix();
                var direction = new BABYLON.Vector3(0, 0, speed);
                var resultDirection = new BABYLON.Vector3(0, 0, 0);
                BABYLON.Vector3.TransformNormalToRef(direction, transformationMatrix, resultDirection);
                _this._camera.cameraDirection.addInPlace(resultDirection);
                var camera;
                camera = _this._camera;
                camera._offsetX = 0.000001;
            }
            if (_this.moving.left) {
                var speed = 0.1;
                var transformationMatrix = _this._camera.getWorldMatrix();
                var direction = new BABYLON.Vector3(-speed, 0, 0);
                var resultDirection = new BABYLON.Vector3(0, 0, 0);
                BABYLON.Vector3.TransformNormalToRef(direction, transformationMatrix, resultDirection);
                _this._camera.cameraDirection.addInPlace(resultDirection);
                var camera;
                camera = _this._camera;
                camera._offsetX = 0.000001;
            }
            else if (_this.moving.right) {
                var speed = 0.1;
                var transformationMatrix = _this._camera.getWorldMatrix();
                var direction = new BABYLON.Vector3(speed, 0, 0);
                var resultDirection = new BABYLON.Vector3(0, 0, 0);
                BABYLON.Vector3.TransformNormalToRef(direction, transformationMatrix, resultDirection);
                _this._camera.cameraDirection.addInPlace(resultDirection);
                var camera;
                camera = _this._camera;
                camera._offsetX = 0.000001;
            }
        });
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this._engine.resize();
        this.menu.multilevelpushmenu('redraw');
    };
    return AzureLens;
})();
//*********************************************************   
//   
//AzureLens.Net, https://github.com/matvelloso/azurelens 
//  
//Copyright (c) Microsoft Corporation  
//All rights reserved.   
//  
// MIT License:  
// Permission is hereby granted, free of charge, to any person obtaining  
// a copy of this software and associated documentation files (the  
// ""Software""), to deal in the Software without restriction, including  
// without limitation the rights to use, copy, modify, merge, publish,  
// distribute, sublicense, and/or sell copies of the Software, and to  
// permit persons to whom the Software is furnished to do so, subject to  
// the following conditions:  
// The above copyright notice and this permission notice shall be  
// included in all copies or substantial portions of the Software.  
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,  
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF  
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND  
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE  
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION  
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION  
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
//   
//*********************************************************   
//# sourceMappingURL=app.js.map