import {
  html,
  css,
  TemplateResult,
  CSSResultGroup,
  ControlElement,
  PropertyValues
} from '@refinitiv-ui/core';
import { customElement } from '@refinitiv-ui/core/lib/decorators/custom-element.js';
import { property } from '@refinitiv-ui/core/lib/decorators/property.js';
import { VERSION } from '../version.js';

import '../icon/index.js';
import '../label/index.js';

/**
 * A building block for individual tab
 * @attr {boolean} disabled - Set disabled state
 * @prop {boolean} [disabled=false] - Set disabled state
 *
 * @fires clear - Dispatched when click on cross button occurs
 */
@customElement('ef-tab', {
  alias: 'coral-tab'
})
export class Tab extends ControlElement {

  /**
   * Element version number
   * @returns version number
   */
  static get version (): string {
    return VERSION;
  }

  protected readonly defaultRole = 'tab';

  /**
   * A `CSSResultGroup` that will be used
   * to style the host, slotted children
   * and the internal template of the element.
   * @returns CSS template
   */
  static get styles (): CSSResultGroup {
    return css`
      :host {
        display: inline-flex;
        flex-shrink: 0;
      }
      :host(:not(:empty)) [part=label],
      :host(:not(:empty)) [part=sub-label] {
        display: none;
      }
    `;
  }

  /**
   * Aria indicating current select state
   * @ignore
   */
  @property({ type: String, reflect: true, attribute: 'aria-selected' })
  public ariaSelected = 'false';

  /**
   * Specify icon name to display in tab
   */
  @property({ type: String })
  public icon = '';

  /**
   * Specify tab's label text
   */
  @property({ type: String })
  public label = '';

  /**
   * Specify tab's sub-label text
   */
  @property({ type: String, attribute: 'sub-label' })
  public subLabel = '';

  private _active = false;

  /**
   * Specify tab's active status
   * @param value active value
   * @default false
   */
  @property({ type: Boolean, reflect: true })
  public set active (value: boolean) {
    const oldValue = this._active;
    if (oldValue !== value) {
      this._active = value;
      this.ariaSelected = String(value);
      void this.requestUpdate('active', oldValue);
    }
  }
  public get active (): boolean {
    return this._active;
  }

  /**
   * Set tab to clearable
   */
  @property({ type: Boolean, reflect: true })
  public clears = false;

  /**
   * Limit the number of lines before truncating
   */
  @property({ type: Number, reflect: true, attribute: 'line-clamp' })
  public lineClamp = 1;

  /**
   * Set tab to clearable on hover
   */
  @property({ type: Boolean, reflect: true, attribute: 'clears-on-hover' })
  public clearsOnHover = false;

  /**
   * Use level styling from theme
   * @ignore
   */
  @property({ type: String, reflect: true })
  public level: '1' | '2' | '3' = '1';

  /**
   * Called after the element’s DOM has been updated the first time.
   * register scroll event on content element to toggle scroll button
   * @param changedProperties Properties that has changed
   * @returns {void}
   */
  protected firstUpdated (changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.addEventListener('keydown', this.onKeyDown);
  }

  /**
   * Omitted lineClamp if subLabel is provided
   * @returns line Clamp value
   */
  private getLineClamp (): number {
    return !this.lineClamp ? 0 : this.subLabel ? 1 : this.lineClamp;
  }

  /**
   * @param event event from close button
   * @returns {void}
   */
  private handleClickClear (event: MouseEvent): void {
    event.stopPropagation();
    /**
     * Fires when click on cross occurs
     */
    this.dispatchEvent(new CustomEvent('clear'));
  }

  /**
   * Handles key down event
   * @param event Key down event object
   * @returns {void}
   */
  private onKeyDown (event: KeyboardEvent): void {
    if (event.defaultPrevented) {
      return;
    }
    if(event.key === 'Delete' && (this.clears || this.clearsOnHover)) {
      this.dispatchEvent(new CustomEvent('clear'));
    }
  }

  /**
   * Show Close Button if allow clears
   * @returns close button template
   */
  private get CloseTemplate (): TemplateResult | null {
    return this.clears || this.clearsOnHover ? html`
        <div part="close-container">
          <ef-icon part="close" icon="cross" @tap="${this.handleClickClear}"></ef-icon>
        </div>
      ` : null;
  }

  /**
   * Create ef-label template if label is provided
   * @returns Label template
   */
  private get LabelTemplate (): TemplateResult | null {
    if(!this.label) {
      return null;
    }
    return html`
      <ef-label
        part="label"
        .lineClamp=${this.getLineClamp()}>
        ${this.label}
      </ef-label>
    `;
  }

  /**
   * Create ef-label template if subLabel is provided
   * @returns SubLabel template
   */
  private get SubLabelTemplate (): TemplateResult | null {
    if(!this.subLabel) {
      return null;
    }
    return html`
      <ef-label
        part="sub-label"
        .lineClamp=${this.getLineClamp()}
      >
        ${this.subLabel}
      </ef-label>
    `;
  }

  /**
   * A `TemplateResult` that will be used
   * to render the updated internal template.
   * @return Render template
   */
  protected render (): TemplateResult {
    return html`
      ${this.icon ? html`<ef-icon icon=${this.icon} part="icon"></ef-icon>` : null}
        <div part="label-container">
          ${this.LabelTemplate}
          ${this.SubLabelTemplate}
          <slot></slot>
        </div>
      ${this.CloseTemplate}
    `;
  }
}
