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
Dynamsoft.WebTwainEnv.Containers = [{ContainerId:'dwtcontrolContainer', Width:'300px', Height:'400px'}];
///
Dynamsoft.WebTwainEnv.ProductKey = 'AFE711AF9936044A18885242E705C38E21E7E32541EC6E06628D550F767EC97F20DC2F21FEBA9B7FC832D4FF4FAB908C8CB1DA42B6942FFF21CED7E80F4BCAF2A212AFF5795768319F5BE63CCB1640232E6B9BD47B1688FC988E2FC1A9E3ACAE03B1D482FFB5F7E0C2EB751EE9FA9147D93D57D04D607E7C747BAE0B955CFA720EBB57FAA77085B54368F7D52F90AEEC779AA9812514EBC51BBF6703E437BA6E1D9D623FD8C6F07DEEB1FAD92CB965EC4C88E10E923ABE37FFFFF9FC96ECC5A5A3F1C6372B6DE6521F349FBE6CCF389CCC978329F3D1D1C5C65C6D651B5749C9E53E3DD57B79FBCAA8B15AD073217A19560FE871A6B04632E66D6D6C47D64CC8DED648092831B67F1E12FFAC46AF14920B5E78FBBB614B023FDCF05275';
///
Dynamsoft.WebTwainEnv.Trial = true;
///
Dynamsoft.WebTwainEnv.ActiveXInstallWithCAB = false;
///
Dynamsoft.WebTwainEnv.Debug = false;
/*Dynamsoft Code*/
var AppComponent = (function () {
    function AppComponent() {
		this.webTwain = null;
		this.twainSources = [];
		this.selectedTwainSource = null;
    }
	AppComponent.prototype.AcquireImage = function() {
        var param = {
            IfShowUI: false,
            IfFeederEnabled: true,
            Resolution: 200,
            IfDuplexEnabled: false,
            PixelType: 2
        };
        if (this.selectedTwainSource) {
            if (!this.webTwain.SelectSourceByIndex(this.selectedTwainSource.idx)
                || !this.webTwain.OpenSource()
                || !this.webTwain.AcquireImage(param, function () {
                }, function (errorCode, errorString) {
                    console.dir({ errorCode: errorCode, errorString: errorString });
                })) {
                console.dir({ errorCode: this.webTwain.ErrorCode, errorString: this.webTwain.ErrorString });
            }
        }
	};
	AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        Dynamsoft.WebTwainEnv.Load();
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', function () {
            console.log("OnWebTwainReady");
            _this.webTwain = Dynamsoft.WebTwainEnv.GetWebTwain('dwtcontrolContainer');
            if (_this.webTwain) {
                for (var i = 0; i < _this.webTwain.SourceCount; i++) {
                    _this.twainSources.push({ idx: i, name: _this.webTwain.GetSourceNameItems(i) });
                }
                _this.webTwain.IfDisableSourceAfterAcquire = true;
                _this.webTwain.SetViewMode(2, 2);
            }
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: '<select [(ngModel)]="selectedTwainSource" ><option *ngFor="let source of twainSources" [ngValue]="source">{{source.name}}</option></select>'+
			'<button (click)="AcquireImage();">Start Scan</button><div id="dwtcontrolContainer"></div>'
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map