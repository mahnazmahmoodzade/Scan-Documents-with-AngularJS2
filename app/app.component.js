"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/*Dynamsoft Code*/
Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: 'dwtcontrolContainer', Width: '300px', Height: '400px' }];
///
Dynamsoft.WebTwainEnv.ProductKey = 'AFE711AF9936044A18885242E705C38E21E7E32541EC6E06628D550F767EC97F20DC2F21FEBA9B7FC832D4FF4FAB908C8CB1DA42B6942FFF21CED7E80F4BCAF2A212AFF5795768319F5BE63CCB1640232E6B9BD47B1688FC988E2FC1A9E3ACAE03B1D482FFB5F7E0C2EB751EE9FA9147D93D57D04D607E7C747BAE0B955CFA720EBB57FAA77085B54368F7D52F90AEEC779AA9812514EBC51BBF6703E437BA6E1D9D623FD8C6F07DEEB1FAD92CB965EC4C88E10E923ABE37FFFFF9FC96ECC5A5A3F1C6372B6DE6521F349FBE6CCF389CCC978329F3D1D1C5C65C6D651B5749C9E53E3DD57B79FBCAA8B15AD073217A19560FE871A6B04632E66D6D6C47D64CC8DED648092831B67F1E12FFAC46AF14920B5E78FBBB614B023FDCF05275';
///
Dynamsoft.WebTwainEnv.Trial = true;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false;
///
Dynamsoft.WebTwainEnv.ResourcesPath = 'Resources';
/*Dynamsoft Code*/
var AppComponent = (function () {
    function AppComponent() {
        this.DWObject = null;
        this.CurrentPath = null;
        this.twainSources = [];
        this.selectedTwainSource = null;
    }
    AppComponent.prototype.downloadPDFR = function () {
        var _this = this;
        _this.DWObject.Addon.PDF.Download('http://' + location.host + _this.CurrentPath + 'Resources/addon/Pdf.zip', function () {
            document.getElementById('info').style.display = 'none';
        }, function (errorCode, errorString) {
            console.log(errorString);
        });
    };
    ;
    AppComponent.prototype.AcquireImage = function () {
        var param = {
            IfShowUI: false,
            IfFeederEnabled: true,
            Resolution: 200,
            IfDuplexEnabled: false,
            PixelType: 2
        };
        if (this.selectedTwainSource) {
            if (!this.DWObject.SelectSourceByIndex(this.selectedTwainSource.idx)
                || !this.DWObject.OpenSource()
                || !this.DWObject.AcquireImage(param, function () {
                }, function (errorCode, errorString) {
                    console.dir({ errorCode: errorCode, errorString: errorString });
                })) {
                console.dir({ errorCode: this.DWObject.ErrorCode, errorString: this.DWObject.ErrorString });
            }
        }
    };
    ;
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        Dynamsoft.WebTwainEnv.Load();
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function () {
            console.log("OnWebTwainReady");
            _this.CurrentPath = decodeURI(location.pathname).substring(0, decodeURI(location.pathname).lastIndexOf("/") + 1);
            _this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
            if (_this.DWObject) {
                for (var i = 0; i < _this.DWObject.SourceCount; i++) {
                    _this.twainSources.push({ idx: i, name: _this.DWObject.GetSourceNameItems(i) });
                }
                _this.DWObject.IfDisableSourceAfterAcquire = true;
                _this.DWObject.SetViewMode(2, 2);
            }
            /*
            * Make sure the PDF Rasterizer and OCR add-on are already installedsample
            */
            if (!Dynamsoft.Lib.env.bMac) {
                var localPDFRVersion = _this.DWObject._innerFun('GetAddOnVersion', '["pdf"]');
                if (Dynamsoft.Lib.env.bIE) {
                    localPDFRVersion = _this.DWObject.getSWebTwain().GetAddonVersion("pdf");
                }
                if (localPDFRVersion != Dynamsoft.PdfVersion) {
                    var ObjString = [];
                    document.getElementById('info').style.display = 'block';
                }
                else {
                }
            }
        });
    };
    ;
    AppComponent.prototype.LoadImages = function () {
        var _this = this;
        if (_this.DWObject) {
            var nCount = 0, nCountLoaded = 0, aryFilePaths = [];
            _this.DWObject.IfShowFileDialog = false;
            function ds_load_pdfa(bSave, filesCount, index, path, filename) {
                nCount = filesCount;
                if (nCount == -1) {
                    Dynamsoft.Lib.detect.hideMask();
                    return;
                }
                var filePath = path + "\\" + filename, _oFile = { _filePath: '', _fileIsPDF: false };
                _oFile._filePath = filePath;
                _oFile._fileIsPDF = false;
                if ((filename.substr(filename.lastIndexOf('.') + 1)).toLowerCase() == 'pdf') {
                    _oFile._fileIsPDF = true;
                }
                aryFilePaths.push(_oFile);
                if (aryFilePaths.length == nCount) {
                    var i = 0;
                    function loadFileOneByOne() {
                        if (aryFilePaths[i]._fileIsPDF) {
                            _this.DWObject.Addon.PDF.SetResolution(200);
                            _this.DWObject.Addon.PDF.SetConvertMode(1);
                        }
                        _this.DWObject.LoadImage(aryFilePaths[i]._filePath, function () {
                            console.log('Load Image:' + aryFilePaths[i]._filePath + ' -- successful');
                            i++;
                            if (i != nCount)
                                loadFileOneByOne();
                        }, function (errorCode, errorString) {
                            alert('Load Image:' + aryFilePaths[i]._filePath + errorString);
                        });
                    }
                    loadFileOneByOne();
                }
            }
            _this.DWObject.RegisterEvent('OnGetFilePath', ds_load_pdfa);
            _this.DWObject.RegisterEvent('OnPostLoad', function (path, name, type) {
                nCountLoaded++;
                console.log('load' + nCountLoaded);
                if (nCountLoaded == nCount) {
                    _this.DWObject.UnregisterEvent('OnGetFilePath', ds_load_pdfa);
                    Dynamsoft.Lib.detect.hideMask();
                }
            });
            _this.DWObject.ShowFileDialog(false, "BMP, JPG, PNG, PDF and TIF | *.bmp;*.jpg;*.png;*.pdf;*.tif;*.tiff", 0, "", "", true, true, 0);
            Dynamsoft.Lib.detect.showMask();
        }
    };
    ;
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: '<div id="info" style="display:none; padding:20px 30px; width: 350px; border: solid 1px #e7e7e7;">The <strong>PDF Rasterizer</strong> is not installed on this PC' +
                '<br />Please click the button below to get it installed<p>' +
                '<button (click)="downloadPDFR();">Install PDF Rasterizer</button>' +
                '</p><i><strong>The installation is a one-time process</strong> <br />' +
                'It might take some time depending on your network.</i></div>' +
                '<br /><select [(ngModel)]="selectedTwainSource" ><option *ngFor="let source of twainSources" [ngValue]="source">{{source.name}}</option></select>' +
                '<button (click)="AcquireImage();">Start Scan</button><button (click)="LoadImages();">Load Images</button><div id="dwtcontrolContainer"></div>'
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map