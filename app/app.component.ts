import { Component } from '@angular/core';
/*Dynamsoft Code*/
Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:'300px', Height:'400px'}];
///
Dynamsoft.WebTwainEnv.Trial = true;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false;
///
Dynamsoft.WebTwainEnv.ResourcesPath = 'Resources';
/*Dynamsoft Code*/
@Component({
  selector: 'my-app',
  template: '<div id="info" style="display:none; padding:20px 30px; width: 350px; border: solid 1px #e7e7e7;">The <strong>PDF Rasterizer</strong> is not installed on this PC'+
			'<br />Please click the button below to get it installed<p>'+
			'<button (click)="downloadPDFR();">Install PDF Rasterizer</button>'+
			'</p><i><strong>The installation is a one-time process</strong> <br />'+
			'It might take some time depending on your network.</i></div>'+
			'<br /><select [(ngModel)]="selectedTwainSource" ><option *ngFor="let source of twainSources" [ngValue]="source">{{source.name}}</option></select>'+
			'<button (click)="AcquireImage();">Start Scan</button><button (click)="LoadImages();">Load Images</button><div id="dwtcontrolContainer"></div>'
})
export class AppComponent {
	DWObject = null;
	CurrentPath = null;
	twainSources: TwainSource[] = [];
	selectedTwainSource:TwainSource = null;
	downloadPDFR() {
		var _this = this;
		_this.DWObject.Addon.PDF.Download(
			'http://' +location.host + _this.CurrentPath + 'Resources/addon/Pdf.zip',
			function () {/*console.log('PDF dll is installed');*/
				document.getElementById('info').style.display = 'none';
			},
			function (errorCode, errorString) {
				console.log(errorString);
			}
		);
	};
	AcquireImage() {
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
	ngAfterViewInit() {
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
					/**/
				}
			}
        });
	};
	LoadImages() {
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
				var filePath = path + "\\" + filename, _oFile = {_filePath:'',_fileIsPDF:false};
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
						_this.DWObject.LoadImage(aryFilePaths[i]._filePath,
							function () {
								console.log('Load Image:' + aryFilePaths[i]._filePath + ' -- successful');
								i++;
								if (i != nCount)
									loadFileOneByOne();
							},
							function (errorCode, errorString) {
								alert('Load Image:' + aryFilePaths[i]._filePath + errorString);
							}
						);
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
			_this.DWObject.ShowFileDialog(false, "BMP, JPG, PNG, PDF and TIF | *.bmp;*.jpg;*.png;*.pdf;*.tif;*.tiff", 0, "", "", true, true, 0)
			Dynamsoft.Lib.detect.showMask();
		}
	};
}
declare var Dynamsoft;

export interface TwainSource {
    idx: number;
    name: string;
}