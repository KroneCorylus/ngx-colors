import { NgxColorsTriggerDirective } from './ngx-colors-trigger.directive';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgxColorsModule } from '../ngx-colors.module';
import { NgxColorsComponent } from '../ngx-colors.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';


describe('NgxColorsTriggerDirective', () => {

    const COLOR_PALETTE: string[] = [
        '#F44336',
        '#E91E63',
        '#9C27B0',
        '#673AB7',
        '#3F51B5',
        '#2196F3',
        '#03A9F4',
        '#00BCD4',
        '#009688',
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFEB3B',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#795548',
        '#9E9E9E',
        '#607D8B',
    ];

    describe('a ngx-colors control in a template driven form', () => {

        @Component({
            template: `
                <form #form="ngForm">
                    <ngx-colors ngx-colors-trigger
                                name="color"
                                [(ngModel)]="color"
                                format="hex"
                                [palette]="COLOR_PALETTE"/>
                </form>
            `,
            standalone: true,
            changeDetection: ChangeDetectionStrategy.Default,
            imports: [
                NgxColorsModule,
                FormsModule,
            ]
        })
        class TestHostComponent {
            @ViewChild(NgxColorsComponent)
            public component!: NgxColorsComponent;

            public color: string | null | undefined = undefined;
            public readonly COLOR_PALETTE = COLOR_PALETTE;
        }

        let hostComponent: TestHostComponent;
        let fixture: ComponentFixture<TestHostComponent>;
        const testHostComponent = TestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                providers: [
                    provideNoopAnimations(),
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(testHostComponent);
            hostComponent = fixture.componentInstance;
            fixture.detectChanges();
            hostComponent.component.ngOnInit();
            await waitForChanges(fixture);
        });

        it('should be pristine when initialized with non-null value', async () => {
            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-pristine');
        });

        it('should be pristine when input changes programmatically', async () => {
            hostComponent.color = '#dc3545';

            await waitForChanges(fixture);

            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-pristine');
        });

        it('should be dirty when the user changes the value via the panel', async () => {
            const directive = fixture.debugElement.query(By.directive(NgxColorsTriggerDirective));
            directive.triggerEventHandler('click');
            await waitForChanges(fixture);

            document.querySelectorAll('.circle.color.circle-border')[0].dispatchEvent(new Event('click'));
            await waitForChanges(fixture);

            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-touched');
            expect(debugElement.nativeElement).toHaveClass('ng-dirty');
        });
    });

    describe('a ngx-colors control in a reactive form', () => {

        @Component({
            template: `
                <form [formGroup]="form">
                    <ngx-colors ngx-colors-trigger
                                formControlName="color"
                                format="hex"
                                [palette]="COLOR_PALETTE"/>
                </form>
            `,
            standalone: true,
            changeDetection: ChangeDetectionStrategy.Default,
            imports: [
                NgxColorsModule,
                ReactiveFormsModule,
            ],
        })
        class TestHostComponent {
            @ViewChild(NgxColorsComponent)
            public component!: NgxColorsComponent;

            public readonly COLOR_PALETTE = COLOR_PALETTE;

            public form = new FormGroup({
                color: new FormControl(undefined)
            });
            protected readonly undefined = undefined;
        }

        let hostComponent: TestHostComponent;
        let fixture: ComponentFixture<TestHostComponent>;
        const testHostComponent = TestHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                providers: [
                    provideNoopAnimations(),
                ],
            }).compileComponents();

            fixture = TestBed.createComponent(testHostComponent);
            hostComponent = fixture.componentInstance;
            fixture.detectChanges();
            hostComponent.component.ngOnInit();
            await waitForChanges(fixture);
        });

        it('should be pristine when initialized with non-null value', async () => {
            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-pristine');
        });

        it('should be pristine when input changes programmatically', async () => {
            hostComponent.form.controls.color.setValue('#dc3545');
            await waitForChanges(fixture);

            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-pristine');
        });

        it('should be dirty when the user changes the value via the panel', async () => {
            const directive = fixture.debugElement.query(By.directive(NgxColorsTriggerDirective));
            directive.triggerEventHandler('click');
            await waitForChanges(fixture);

            document.querySelectorAll('.circle.color.circle-border')[0].dispatchEvent(new Event('click'));
            await waitForChanges(fixture);

            const debugElement = getFormDebugElement(fixture);
            expect(debugElement.nativeElement).toHaveClass('ng-touched');
            expect(debugElement.nativeElement).toHaveClass('ng-dirty');
        });
    });

    async function waitForChanges(fixture: ComponentFixture<any>) {
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
    }

    function getFormDebugElement(fixture: ComponentFixture<any>) {
        return fixture.debugElement.query(By.css('form'));
    }
});
