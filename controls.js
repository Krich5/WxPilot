/**
 * WxPilot
 * Version: 2.2.0 (Copyright (c) Krich5) 
 */

(function() {
  console.log('🚀 Supervisor Controls v2.2.0 loading...');
  const template = document.createElement('template');
  template.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      :host {
        display: block;
        font-family: 'Inter', 'CiscoSansTT Regular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        padding: 12px;
        background: transparent;
        height: 100%;
        overflow-y: auto;
        --card-bg: rgba(255, 255, 255, 0.52);
        --card-border: rgba(213, 222, 235, 0.9);
        --card-text: #0f172a;
        --muted-text: #374151;
        --chip-bg: rgba(255, 255, 255, 0.42);
        --chip-border: rgba(219, 228, 240, 0.6);
        --chip-status-bg: rgba(224, 242, 254, 0.58);
        --chip-status-border: rgba(191, 219, 254, 0.65);
        --input-border: rgba(215, 224, 236, 0.7);
        --input-bg: rgba(255, 255, 255, 0.6);
        --message-bg: rgba(255, 255, 255, 0.46);
        --message-border: rgba(223, 230, 241, 0.65);
        --card-bg-edit: rgba(255, 255, 255, 0.38);
        --message-bg-edit: rgba(255, 255, 255, 0.36);
        --value-text: rgba(55, 65, 81, 0.72);
        --edit-text: #111827;
        --title-text: #1f2937;
        --card-shadow: 0 10px 28px rgba(0, 0, 0, 0.14);
        --popover-bg: #ffffff;
        --select-chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23374151' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      }
      :host(.theme-dark) {
        /* Translucent neutrals (not solid fills) so all 3 WxCC wallpapers
           (Default/Serene/Aurora) show through the panel, matching how
           Cisco's own surfaces stay see-through regardless of background. */
        --card-bg: rgba(24, 24, 27, 0.5);
        --card-border: rgba(255, 255, 255, 0.28);
        --card-text: #f1f5f9;
        --muted-text: #cbd5e1;
        --chip-bg: rgba(24, 24, 27, 0.42);
        --chip-border: rgba(255, 255, 255, 0.28);
        --chip-status-bg: rgba(56, 189, 248, 0.16);
        --chip-status-border: rgba(56, 189, 248, 0.35);
        --input-border: rgba(255, 255, 255, 0.34);
        --input-bg: rgba(15, 15, 17, 0.48);
        --message-bg: rgba(15, 15, 17, 0.38);
        --message-border: rgba(255, 255, 255, 0.26);
        --card-bg-edit: rgba(39, 39, 42, 0.58);
        --message-bg-edit: rgba(39, 39, 42, 0.5);
        --value-text: rgba(226, 232, 240, 0.82);
        --edit-text: #f8fafc;
        --title-text: #ffffff;
        --card-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
        --popover-bg: #1c1c1f;
        --select-chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23cbd5e1' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
      }
      
      .container {
        width: 100%;
        margin: 0;
        background: transparent;
        border-radius: 8px;
        box-shadow: none;
        overflow: hidden;
      }
      
      .content {
        padding: 16px;
        max-width: none;
        margin-right: 0;
      }
      
      .message {
        padding: 12px 16px;
        border-radius: 4px;
        margin-bottom: 16px;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .message.error {
        background: #f8d7da;
        color: #721c24;
        border-left: 4px solid #dc3545;
      }
      
      .variables-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
        align-items: start;
      }
      .variables-grid.two-cols {
        grid-template-columns: minmax(500px, 2.2fr) minmax(200px, 1fr);
        gap: 12px;
      }
      .left-column, .right-column {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      @media (max-width: 900px) {
        .variables-grid.two-cols {
          grid-template-columns: 1fr;
        }
        .variables-grid.two-cols .right-column {
          order: -1; /* Move booleans to top on mobile */
        }
      }
      
      .variable-card {
        background: var(--card-bg);
        border: 1px solid var(--card-border);
        border-radius: 18px;
        padding: 16px;
        transition: all 0.2s;
        position: relative;
        box-sizing: border-box;
        box-shadow: var(--card-shadow);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        overflow: hidden;
      }
      .variable-card.editing {
        background: var(--card-bg-edit);
        border-color: var(--card-border);
        box-shadow: var(--card-shadow);
      }
      .variable-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: #049fd9;
      }

      .section-divider {
        border: 0;
        height: 3px;
        background: var(--card-border);
        margin: 18px 0;
        border-radius: 2px;
      }
      .calendar-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .string-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(280px, 1fr));
        gap: 12px;
      }
      @media (max-width: 900px) {
        .string-grid {
          grid-template-columns: 1fr;
        }
      }
      .boolean-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      
      .variable-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
      }
      
      .variable-name {
        font-weight: 700;
        color: var(--title-text);
        font-size: 15px;
        word-break: break-word;
        flex: 1;
      }
      
      .icon-btn {
        background: none;
        border: none;
        padding: 6px;
        cursor: pointer;
        border-radius: 4px;
        color: var(--muted-text);
        transition: all 0.2s;
        font-size: 16px;
      }
      
      .icon-btn:hover {
        background: var(--message-bg);
        color: var(--card-text);
      }
      
      .icon-btn.edit:hover {
        color: #049fd9;
      }
      
      .icon-btn.save {
        color: #16a34a;
      }
      .icon-btn.save:hover {
        color: #0f9a3c;
      }
      
      .cancel-btn:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }
      
      .switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 28px;
      }
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cbd5e1;
        transition: .2s;
        border-radius: 24px;
      }
      .slider:before {
        position: absolute;
        content: "";
        height: 22px;
        width: 22px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .2s;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.15);
      }
      .switch input:checked + .slider {
        background-color: #049fd9;
      }
      .switch input:checked + .slider:before {
        transform: translateX(22px);
      }
      :host(.theme-dark) .slider {
        background-color: #6b7280;
      }
      :host(.theme-dark) .switch input:checked + .slider:before {
        background-color: #000000;
      }

      .override-view {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
      .override-chip {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: var(--chip-bg);
        border: 1px solid var(--chip-border);
        border-radius: 999px;
        padding: 8px 12px;
        font-weight: 600;
        color: var(--card-text);
        white-space: nowrap;
      }
      .override-label {
        font-weight: 700;
        color: var(--card-text);
      }
      .override-toggle {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        color: var(--card-text);
      }
      .override-message-view {
        width: 100%;
        box-sizing: border-box;
        background: var(--message-bg);
        border: 1px solid var(--message-border);
        border-radius: 14px;
        padding: 12px 14px;
        font-family: 'Inter', 'CiscoSansTT Regular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        min-height: 140px;
        margin-top: 8px;
        color: var(--value-text);
      }
      .inline-textarea {
        resize: vertical;
        min-height: 100px;
        font-family: 'Inter', 'CiscoSansTT Regular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 15px;
        line-height: 1.5;
        letter-spacing: 0.2px;
        width: 100%;
        padding: 12px;
        border: 1px solid var(--input-border);
        border-radius: 6px;
        box-sizing: border-box;
        color: var(--card-text);
        background: var(--input-bg);
      }
      .inline-textarea.override-msg {
        min-height: 140px;
      }
      .editing .inline-textarea,
      .editing .override-input,
      .editing .override-msg,
      .editing .variable-value,
      .editing .override-message-view {
        background: var(--message-bg-edit);
        color: var(--edit-text);
        box-shadow: none;
      }
      .override-input {
        border: 1px solid var(--input-border);
        border-radius: 10px;
        padding: 10px 12px;
        font-size: 14px;
        color: var(--card-text);
        background: var(--input-bg);
      }

      .business-hours-grid {
        display: grid;
        grid-template-columns: repeat(7, minmax(80px, 1fr));
        gap: 8px;
      }
      /* The 7-day grid has a hard 7*80px minimum, which overflows any
         phone-width viewport (and, since app.html measures this card's
         scrollWidth to decide how much to shrink the whole widget, was
         forcing the ENTIRE layout to scale down as one block instead of
         reflowing normally). Collapsing it to fewer columns removes that
         overflow so cards can lay out — and stack — at their natural size. */
      @media (max-width: 900px) {
        .business-hours-grid {
          grid-template-columns: repeat(4, minmax(70px, 1fr));
        }
      }
      @media (max-width: 480px) {
        .business-hours-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      .business-hours-cell {
        background: var(--message-bg);
        border: 1px solid var(--message-border);
        border-radius: 12px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-height: 74px;
      }
      .business-hours-day {
        font-weight: 700;
        color: var(--title-text);
        font-size: 12px;
        letter-spacing: 0.02em;
      }
      .business-hours-time {
        font-weight: 600;
        color: var(--card-text);
        font-size: 12px;
      }
      .business-hours-edit {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .business-hours-input {
        border: 1px solid var(--input-border);
        border-radius: 8px;
        background: var(--input-bg);
        color: var(--card-text);
        padding: 4px 6px;
        font-size: 12px;
      }
      /* Native date/time inputs render their calendar/clock icon as a
         fixed dark glyph regardless of page theme — invisible against a
         dark background. Invert it in dark mode only; light mode is
         already fine as-is. */
      :host(.theme-dark) input[type="time"]::-webkit-calendar-picker-indicator,
      :host(.theme-dark) input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1) brightness(1.6);
        cursor: pointer;
      }
      .business-hours-shifts {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .business-hours-shift {
        display: grid;
        grid-template-columns: minmax(160px, 1.1fr) minmax(200px, 1fr) minmax(200px, 1fr) auto auto;
        gap: 10px;
        align-items: center;
        padding: 10px;
        border: 1px solid var(--message-border);
        background: var(--message-bg);
        border-radius: 12px;
      }
      @media (max-width: 1200px) {
        .business-hours-shift {
          grid-template-columns: 1fr 1fr;
          align-items: stretch;
        }
        .business-hours-shift > *:nth-child(4),
        .business-hours-shift > *:nth-child(5) {
          grid-column: span 2;
        }
      }
      @media (max-width: 600px) {
        .business-hours-shift {
          grid-template-columns: 1fr;
          align-items: stretch;
        }
      }
      .shift-days {
        display: grid;
        grid-template-columns: repeat(7, minmax(34px, 1fr));
        gap: 6px 8px;
        font-size: 11px;
        color: var(--muted-text);
      }
      .shift-days label {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      }
      .shift-remove {
        border: 1px solid var(--card-border);
        background: transparent;
        color: #b91c1c;
        border-radius: 8px;
        padding: 6px 10px;
        font-weight: 600;
        cursor: pointer;
      }
      .shift-add {
        border: 1px solid var(--card-border);
        background: var(--chip-bg);
        color: var(--card-text);
        border-radius: 10px;
        padding: 6px 12px;
        font-weight: 600;
        cursor: pointer;
        align-self: flex-start;
      }

      .business-hours-top-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px;
        margin-bottom: 12px;
      }
      .linked-refs {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
        position: relative;
        flex: 0 1 auto;
      }
      .calendar-select,
      .linked-ref-btn,
      .linked-ref-static {
        box-sizing: border-box;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex: 0 1 auto;
        margin: 0;
        background-color: var(--chip-bg);
        border: 1px solid var(--chip-border);
        border-radius: 10px;
        padding: 0 12px;
        font-size: 13px;
        font-weight: 600;
        font-family: inherit;
        line-height: normal;
        color: var(--card-text);
        text-align: left;
      }
      .calendar-select {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 100%;
        max-width: 300px;
        background-image: var(--select-chevron);
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 30px;
        cursor: pointer;
      }
      .linked-ref-btn {
        cursor: pointer;
      }
      .linked-ref-btn:hover,
      .calendar-select:hover {
        border-color: #049fd9;
      }
      .linked-ref-caret {
        color: var(--muted-text);
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        line-height: 1.6;
        border: 1px solid currentColor;
        white-space: nowrap;
      }
      .status-pill-on {
        color: #10b981;
      }
      .status-pill-off {
        color: #ef4444;
      }
      .holiday-list-detail {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        width: 320px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-height: 152px;
        overflow-y: auto;
        padding: 8px 12px;
        background: var(--popover-bg);
        border: 1px solid var(--message-border);
        border-radius: 10px;
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.45);
      }
      .variable-card.popover-open {
        overflow: visible;
        z-index: 60;
      }
      .holiday-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        font-size: 12px;
        padding: 4px 0;
        border-bottom: 1px solid var(--message-border);
      }
      .holiday-row:last-child {
        border-bottom: none;
      }
      .holiday-name {
        color: var(--card-text);
        font-weight: 600;
      }
      .holiday-dates {
        color: var(--muted-text);
        white-space: nowrap;
      }

      .variable-value {
        background: var(--message-bg);
        padding: 12px;
        border-radius: 12px;
        font-family: 'Inter', 'CiscoSansTT Regular', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        letter-spacing: 0.2px;
        color: var(--value-text);
        word-wrap: break-word;
        word-break: normal;
        overflow-wrap: break-word;
        min-height: 90px;
        max-height: 140px;
        overflow-y: auto;
        border: 1px solid var(--message-border);
      }
      .message-value {
        min-height: 70px;
        max-height: 120px;
      }
      
      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #6c757d;
      }
      
      .empty-state-icon {
        font-size: 48px;
        margin-bottom: 16px;
        opacity: 0.3;
      }
      
      .loading {
        text-align: center;
        padding: 40px;
        color: #6c757d;
      }
      
      .spinner {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #049fd9;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 16px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    
    <div class="container">
      <div class="content">
        <div id="variablesContainer"></div>
        <div id="messageContainer" style="margin-top:12px;"></div>
      </div>
    </div>
  `;

  class GlobalVariableManager extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      
      this.token = '';
      this.orgId = '';
      this.dataCenter = '';
      this.baseUrl = '';
      this.theme = '';
      this.themeExplicit = false;
      this.themeObserver = null;
      this.themeMediaQuery = null;
      this.autoLoad = true;
      this.autoLoadOverrides = true;
      this.autoLoadExplicit = false;
      this.autoLoadOverridesExplicit = false;
      this.overrideName = '';
      this.autoLoadBusinessHours = true;
      this.autoLoadBusinessHoursExplicit = false;
      
      // Configuration storage
      this.textVariables = []; // [{name, id}]
      this.booleanVariables = []; // [{name, id}]
      this.overrideConfig = null; // {id, messageVarId}
      this.businessHoursConfig = null; // {id, name}
      
      this.variables = [];
      this.overrideEntry = null;
      this.overrideError = '';
      this.overridesList = [];
      this.businessHoursEntry = null;
      this.businessHoursList = [];
      this.holidayListsList = [];
      this.expandedHolidayListId = null;
      this.businessHoursError = '';
      this.editingVariableName = null;
      this.successFlags = {};
      this.loadScheduled = null;
      this.hasLoadedOnce = false;
      this.calendarCollapsed = false;
    }
    
    static get observedAttributes() {
      return [
        'token',
        'org-id',
        'data-center',
        'base-url',
        'theme',
        // Auto-load options
        'auto-load',
        'auto-load-overrides',
        'override-name',
        // String/Text variables (up to 10)
        'variable_string_1_name', 'variable_string_1_id',
        'variable_string_2_name', 'variable_string_2_id',
        'variable_string_3_name', 'variable_string_3_id',
        'variable_string_4_name', 'variable_string_4_id',
        'variable_string_5_name', 'variable_string_5_id',
        'variable_string_6_name', 'variable_string_6_id',
        'variable_string_7_name', 'variable_string_7_id',
        'variable_string_8_name', 'variable_string_8_id',
        'variable_string_9_name', 'variable_string_9_id',
        'variable_string_10_name', 'variable_string_10_id',
        // Boolean variables (up to 10)
        'variable_boolean_1_name', 'variable_boolean_1_id',
        'variable_boolean_2_name', 'variable_boolean_2_id',
        'variable_boolean_3_name', 'variable_boolean_3_id',
        'variable_boolean_4_name', 'variable_boolean_4_id',
        'variable_boolean_5_name', 'variable_boolean_5_id',
        'variable_boolean_6_name', 'variable_boolean_6_id',
        'variable_boolean_7_name', 'variable_boolean_7_id',
        'variable_boolean_8_name', 'variable_boolean_8_id',
        'variable_boolean_9_name', 'variable_boolean_9_id',
        'variable_boolean_10_name', 'variable_boolean_10_id',
        // Override configuration
        'override_hours_id',
        'override_message_variable_id',
        'override_hours_variable_id',
        // Business hours configuration
        'business-hours-id',
        'business-hours-name',
        'auto-load-business-hours',
      ];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
      const logValue = name === 'token' ? (newValue ? '[redacted]' : newValue) : newValue;
      console.log(`[GVM v2] Attribute: ${name} = ${logValue}`);

      if (name === 'token') this.token = newValue;
      if (name === 'org-id') this.orgId = newValue;
      if (name === 'data-center') this.dataCenter = newValue;
      if (name === 'base-url') this.baseUrl = newValue;
      if (name === 'theme') {
        this.themeExplicit = !!newValue;
        this.theme = (newValue || '').toLowerCase();
        this.applyThemeClass();
      }
      if (name === 'auto-load') {
        this.autoLoadExplicit = true;
        this.autoLoad = String(newValue).toLowerCase() === 'true';
      }
      if (name === 'auto-load-overrides') {
        this.autoLoadOverridesExplicit = true;
        this.autoLoadOverrides = String(newValue).toLowerCase() === 'true';
      }
      if (name === 'override-name') this.overrideName = newValue || '';
      if (name === 'auto-load-business-hours') {
        this.autoLoadBusinessHoursExplicit = true;
        this.autoLoadBusinessHours = String(newValue).toLowerCase() === 'true';
      }
      if (name === 'business-hours-id') {
        if (!this.businessHoursConfig) this.businessHoursConfig = {};
        this.businessHoursConfig.id = newValue;
      }
      if (name === 'business-hours-name') {
        if (!this.businessHoursConfig) this.businessHoursConfig = {};
        this.businessHoursConfig.name = newValue;
      }
      
      // Handle string/text variables (new naming: variable_string_X_name/id)
      const stringMatch = name.match(/^variable_string_(\d+)_(name|id)$/);
      if (stringMatch) {
        const [, index, prop] = stringMatch;
        const idx = parseInt(index) - 1;
        
        if (!this.textVariables[idx]) {
          this.textVariables[idx] = {};
        }
        
        if (prop === 'name') {
          this.textVariables[idx].name = newValue;
          console.log(`[GVM v2] Set string variable ${index} name: "${newValue}"`);
        }
        if (prop === 'id') {
          this.textVariables[idx].id = newValue;
          console.log(`[GVM v2] Set string variable ${index} id: ${newValue}`);
        }
      }
      
      // Handle legacy text variables (variable_X_name/id - aliases to variable_string_X)
      const textMatch = name.match(/^variable_(\d+)_(name|id)$/);
      if (textMatch) {
        const [, index, prop] = textMatch;
        const idx = parseInt(index) - 1;
        
        if (!this.textVariables[idx]) {
          this.textVariables[idx] = {};
        }
        
        if (prop === 'name') {
          this.textVariables[idx].name = newValue;
          console.log(`[GVM v2] Set text variable ${index} name: "${newValue}"`);
        }
        if (prop === 'id') {
          this.textVariables[idx].id = newValue;
          console.log(`[GVM v2] Set text variable ${index} id: ${newValue}`);
        }
      }
      
      // Handle boolean variables
      const boolMatch = name.match(/^variable_boolean_(\d+)_(name|id)$/);
      if (boolMatch) {
        const [, index, prop] = boolMatch;
        const idx = parseInt(index) - 1;
        
        if (!this.booleanVariables[idx]) {
          this.booleanVariables[idx] = {};
        }
        
        if (prop === 'name') {
          this.booleanVariables[idx].name = newValue;
          console.log(`[GVM v2] Set boolean variable ${index} name: "${newValue}"`);
        }
        if (prop === 'id') {
          this.booleanVariables[idx].id = newValue;
          console.log(`[GVM v2] Set boolean variable ${index} id: ${newValue}`);
        }
      }

      if (!this.autoLoadExplicit &&
          (name.startsWith('variable_string_') ||
           name.startsWith('variable_boolean_') ||
           name.startsWith('variable_'))) {
        this.autoLoad = false;
      }

      if (!this.autoLoadBusinessHoursExplicit &&
          (name === 'business-hours-id' || name === 'business-hours-name')) {
        this.autoLoadBusinessHours = false;
      }
      
      // Handle override configuration
      if (name === 'override_hours_id') {
        if (!this.overrideConfig) this.overrideConfig = {};
        this.overrideConfig.id = newValue;
        console.log(`[GVM v2] Set override id: ${newValue}`);
      }
      if (name === 'override_message_variable_id' || name === 'override_hours_variable_id') {
        if (!this.overrideConfig) this.overrideConfig = {};
        this.overrideConfig.messageVarId = newValue;
        console.log(`[GVM v2] Set override message var id: ${newValue}`);
      }

      this.scheduleLoad();
    }
    
    connectedCallback() {
      this.applyThemeClass();
      this.hydrateAttributes();
      this.setupThemeDetection();
      this.scheduleLoad();
      this._onDocumentClick = this.handleDocumentClick.bind(this);
      document.addEventListener('click', this._onDocumentClick, true);
    }

    disconnectedCallback() {
      if (this.themeObserver) {
        this.themeObserver.disconnect();
        this.themeObserver = null;
      }
      if (this.themeMediaQuery && this._onThemeMediaChange) {
        this.themeMediaQuery.removeEventListener('change', this._onThemeMediaChange);
        this.themeMediaQuery = null;
      }
      if (this._onDocumentClick) {
        document.removeEventListener('click', this._onDocumentClick, true);
        this._onDocumentClick = null;
      }
    }

    // Click-anywhere-to-dismiss for the holiday list popover. Uses
    // composedPath() so clicks inside the shadow DOM are detected correctly;
    // clicks on the toggle button itself are left alone since that button
    // already handles its own open/close toggle.
    handleDocumentClick(e) {
      if (!this.expandedHolidayListId) return;
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      const onToggleButton = path.some(el => el.classList && el.classList.contains('linked-ref-btn'));
      if (onToggleButton) return;
      this.expandedHolidayListId = null;
      this.renderVariables();
    }

    // WxCC's shell never sets a theme attribute on this widget, so detect the
    // live light/dark state directly from Cisco's own theme provider element
    // (mdc-themeprovider's class flips between mds-theme-stable-lightWebex /
    // -darkWebex). Falls back to OS-level prefers-color-scheme if that ever
    // moves. An explicit theme="dark"/"light" attribute, if ever set, wins.
    setupThemeDetection() {
      if (this.themeExplicit) return;

      let provider = null;
      try {
        const app = document.querySelector('agentx-app');
        provider = app && app.shadowRoot ? app.shadowRoot.querySelector('mdc-themeprovider') : null;
      } catch (err) {
        provider = null;
      }

      if (provider) {
        const applyFromProvider = () => {
          const cls = provider.getAttribute('themeclass') || provider.className || '';
          this.theme = /dark/i.test(cls) ? 'dark' : 'light';
          this.applyThemeClass();
        };
        applyFromProvider();
        if (this.themeObserver) this.themeObserver.disconnect();
        this.themeObserver = new MutationObserver(applyFromProvider);
        this.themeObserver.observe(provider, { attributes: true, attributeFilter: ['class', 'themeclass'] });
        return;
      }

      if (window.matchMedia) {
        this.themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this._onThemeMediaChange = () => {
          this.theme = this.themeMediaQuery.matches ? 'dark' : 'light';
          this.applyThemeClass();
        };
        this._onThemeMediaChange();
        this.themeMediaQuery.addEventListener('change', this._onThemeMediaChange);
      }
    }

    applyThemeClass() {
      const host = this.shadowRoot && this.shadowRoot.host;
      if (!host) return;
      host.classList.remove('theme-dark', 'theme-light');
      if (this.theme === 'dark') host.classList.add('theme-dark');
      else host.classList.add('theme-light');
    }

    markSuccess(id) {
      if (!id) return;
      this.successFlags[id] = true;
      setTimeout(() => {
        delete this.successFlags[id];
        this.renderVariables();
      }, 2500);
      this.renderVariables();
    }
    
    showMessage(message, type = 'info') {
      if (type === 'success') return;
      const container = this.shadowRoot.getElementById('messageContainer');
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = message;
      container.appendChild(messageDiv);
      
      setTimeout(() => messageDiv.remove(), 5000);
    }
    
    getApiUrl() {
      if (this.baseUrl) return this.baseUrl;
      const dcMap = {
        'us1': 'https://api.wxcc-us1.cisco.com',
        'eu1': 'https://api.wxcc-eu1.cisco.com',
        'eu2': 'https://api.wxcc-eu2.cisco.com',
        'anz1': 'https://api.wxcc-anz1.cisco.com',
        'ca1': 'https://api.wxcc-ca1.cisco.com'
      };
      
      return dcMap[this.dataCenter] || dcMap['us1'];
    }

    getAllItems() {
      // Filter out override_message type - it only shows under the override section
      const items = this.variables.filter(v => v.variableType !== 'override_message');
      if (this.businessHoursEntry) items.push(this.businessHoursEntry);
      if (this.overrideEntry) items.push(this.overrideEntry);
      return items;
    }

    hydrateAttributes() {
      const attrs = this.constructor.observedAttributes || [];
      for (const name of attrs) {
        if (this.hasAttribute(name)) {
          this.attributeChangedCallback(name, null, this.getAttribute(name));
        }
      }
    }

    hasAnyConfiguredVariables() {
      const hasText = this.textVariables.some(v => v && v.id);
      const hasBool = this.booleanVariables.some(v => v && v.id);
      const hasOverride = this.overrideConfig && (this.overrideConfig.id || this.overrideConfig.messageVarId);
      const hasBusinessHours = this.businessHoursConfig && (this.businessHoursConfig.id || this.businessHoursConfig.name);
      return hasText || hasBool || hasOverride || hasBusinessHours ||
        this.autoLoad || this.autoLoadOverrides || this.autoLoadBusinessHours;
    }

    scheduleLoad() {
      if (!this.isConnected) return;
      if (!this.token || !this.orgId) return;
      if (!this.hasAnyConfiguredVariables()) return;
      if (this.loadScheduled) return;

      this.loadScheduled = setTimeout(() => {
        this.loadScheduled = null;
        this.hasLoadedOnce = true;
        this.loadVariables();
      }, 200);
    }
    
    async loadVariables() {
      console.log('[GVM v2] loadVariables() called');
      console.log('[GVM v2] Text variables config:', this.textVariables);
      console.log('[GVM v2] Boolean variables config:', this.booleanVariables);
      console.log('[GVM v2] Override config:', this.overrideConfig);
      console.log('[GVM v2] Auto-load:', this.autoLoad, 'Auto-load overrides:', this.autoLoadOverrides, 'Auto-load business hours:', this.autoLoadBusinessHours);
      
      if (!this.token || !this.orgId) {
        this.showMessage('Missing authentication credentials', 'error');
        return;
      }
      
      try {
        const container = this.shadowRoot.getElementById('variablesContainer');
        container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading variables...</div>';
        this.overrideEntry = null;
        this.businessHoursEntry = null;
        this.businessHoursError = '';
        this.variables = [];

        if (this.autoLoad) {
          const autoVars = await this.loadAllVariablesList();
          console.log(`[GVM v2] Auto-load variables count: ${autoVars.length}`);
          this.variables.push(...autoVars);
        } else {
          // Load text variables
          const validTextVars = this.textVariables.filter(v => v && v.id);
          console.log(`[GVM v2] Found ${validTextVars.length} valid text variables to load`);
          for (const config of validTextVars) {
            console.log(`[GVM v2] Loading text variable: name="${config.name}", id=${config.id}`);
            const variable = await this.loadVariableById(config.id);
            if (variable) {
              variable.displayName = config.name || variable.name;
              variable.variableType = 'string';
              console.log(`[GVM v2] Loaded variable with displayName: "${variable.displayName}"`);
              this.variables.push(variable);
            }
          }

          // Load boolean variables
          const validBoolVars = this.booleanVariables.filter(v => v && v.id);
          console.log(`[GVM v2] Found ${validBoolVars.length} valid boolean variables to load`);
          for (const config of validBoolVars) {
            console.log(`[GVM v2] Loading boolean variable: name="${config.name}", id=${config.id}`);
            const variable = await this.loadVariableById(config.id);
            if (variable) {
              variable.displayName = config.name || variable.name;
              variable.variableType = 'boolean';
              console.log(`[GVM v2] Loaded boolean with displayName: "${variable.displayName}"`);
              this.variables.push(variable);
            }
          }
        }

        if (this.overrideConfig && this.overrideConfig.messageVarId) {
          const msgVar = this.variables.find(v => v.id === this.overrideConfig.messageVarId);
          if (msgVar) {
            msgVar.displayName = 'Override Message';
            msgVar.variableType = 'override_message';
          }
        }

        // Load override if configured or auto-load enabled
        if ((!this.overrideConfig || !this.overrideConfig.id) && this.autoLoadOverrides) {
          const autoOverrideId = await this.loadFirstOverrideId();
          if (autoOverrideId) {
            if (!this.overrideConfig) this.overrideConfig = {};
            this.overrideConfig.id = autoOverrideId;
            console.log(`[GVM v2] Auto-selected override id: ${autoOverrideId}`);
          }
        }

        if (this.overrideConfig && this.overrideConfig.id) {
          // Load the list of all overrides for the dropdown
          this.overridesList = await this.loadAllOverridesList();
          
          const override = await this.loadOverrideById();
          if (override) {
            override.displayName = 'Override Hours';
            this.overrideEntry = override;
          }
          
          // Load the override message variable if configured
          // This is loaded separately and won't show as its own card
          if (this.overrideConfig.messageVarId) {
            const existingMsg = this.variables.find(v => v.id === this.overrideConfig.messageVarId);
            if (existingMsg) {
              existingMsg.displayName = 'Override Message';
              existingMsg.variableType = 'override_message';
            } else {
              console.log(`[GVM v2] Loading override message variable: ${this.overrideConfig.messageVarId}`);
              const msgVariable = await this.loadVariableById(this.overrideConfig.messageVarId);
              if (msgVariable) {
                msgVariable.displayName = 'Override Message';
                msgVariable.variableType = 'override_message';
                console.log(`[GVM v2] Loaded override message: "${msgVariable.variableValue}"`);
                // Add to variables array so getOverrideMessageVariable() can find it
                this.variables.push(msgVariable);
              }
            }
          }
        }

        // Load business hours if configured or auto-load enabled
        if (!this.businessHoursConfig || !this.businessHoursConfig.id) {
          const shouldAutoSelect = this.autoLoadBusinessHours ||
            (this.businessHoursConfig && this.businessHoursConfig.name);
          if (shouldAutoSelect) {
            const autoBusinessHoursId = await this.loadFirstBusinessHoursId();
            if (autoBusinessHoursId) {
              if (!this.businessHoursConfig) this.businessHoursConfig = {};
              this.businessHoursConfig.id = autoBusinessHoursId;
              console.log(`[GVM v2.2] Auto-selected business hours id: ${autoBusinessHoursId}`);
            }
          }
        }

        if (this.businessHoursConfig && this.businessHoursConfig.id) {
          // Load the list of all business hours for the dropdown
          this.businessHoursList = await this.loadAllBusinessHoursList();
          
          const businessHours = await this.loadBusinessHoursById(this.businessHoursConfig.id);
          if (businessHours) {
            businessHours.displayName = businessHours.name || 'Business Hours';
            this.businessHoursEntry = businessHours;
          }

          // Load holiday lists + overrides so the card can show what's linked
          // (read-only reference, not editable from here)
          this.holidayListsList = await this.loadAllHolidayListsList();
          if (!this.overridesList || !this.overridesList.length) {
            this.overridesList = await this.loadAllOverridesList();
          }
        }

        this.renderVariables();
        this.showMessage(`Loaded ${this.variables.length + (this.overrideEntry ? 1 : 0)} items`, 'success');
      } catch (error) {
        this.showMessage(`Error loading variables: ${error.message}`, 'error');
        const container = this.shadowRoot.getElementById('variablesContainer');
        if (container) container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Error loading variables</p></div>`;
      }
    }

    async loadVariableById(id) {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/cad-variable/${id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          variableValue: data.defaultValue,
          variableType: data.variableType || 'String',
          raw: data
        };
      } catch (error) {
        console.error(`Error loading variable ${id}:`, error);
        return null;
      }
    }

    async loadAllVariablesList() {
      try {
        const apiUrl = this.getApiUrl();
        const results = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const response = await fetch(
            `${apiUrl}/organization/${this.orgId}/v2/cad-variable?page=${page}&pageSize=100`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const items = Array.isArray(data.data) ? data.data : [];
          totalPages = (data.meta && data.meta.totalPages) ? data.meta.totalPages : 1;

          for (const item of items) {
            if (item.active === false) continue;
            const type = (item.variableType || '').toLowerCase();
            const variableType = type === 'boolean' ? 'boolean' : 'string';
            results.push({
              id: item.id,
              name: item.name,
              displayName: item.desktopLabel || item.name,
              variableValue: item.defaultValue,
              variableType,
              raw: item
            });
          }

          page += 1;
        }

        return results;
      } catch (error) {
        console.error('Error loading variables list:', error);
        return [];
      }
    }

    async loadFirstOverrideId() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/v2/overrides?page=0&pageSize=100`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const items = Array.isArray(data.data) ? data.data : [];
        if (!items.length) return null;

        if (this.overrideName) {
          const match = items.find(i => i && i.name === this.overrideName);
          if (match && match.id) return match.id;
        }

        return items[0].id || null;
      } catch (error) {
        console.error('Error loading overrides list:', error);
        return null;
      }
    }

    async loadAllOverridesList() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/v2/overrides?page=0&pageSize=100`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data.data) ? data.data : [];
      } catch (error) {
        console.error('Error loading overrides list:', error);
        return [];
      }
    }

    async loadAllHolidayListsList() {
      try {
        const apiUrl = this.getApiUrl();
        const results = [];
        let page = 0;
        let totalPages = 1;

        while (page < totalPages) {
          const response = await fetch(
            `${apiUrl}/organization/${this.orgId}/v2/holiday-list?page=${page}&pageSize=100`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
              }
            }
          );

          if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const items = Array.isArray(data.data) ? data.data : [];
          totalPages = (data.meta && data.meta.totalPages) ? data.meta.totalPages : 1;
          results.push(...items);
          page += 1;
        }

        return results;
      } catch (error) {
        console.error('Error loading holiday lists:', error);
        return [];
      }
    }

    async loadOverrideById() {
      if (!this.overrideConfig || !this.overrideConfig.id) return null;
      
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/overrides/${this.overrideConfig.id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const latest = data.latestOverride || (data.overrides && data.overrides[0]) || {};
        
        return {
          id: data.id,
          name: data.name || 'Override Hours',
          variableType: 'override',
          startDateTime: latest.startDateTime || '',
          endDateTime: latest.endDateTime || '',
          workingHours: latest.workingHours === true || latest.workingHours === 'true',
          timezone: data.timeZone ?? data.timezone ?? '',
          raw: data
        };
      } catch (err) {
        console.error('Error loading override:', err);
        return null;
      }
    }

    async loadBusinessHoursById(id) {
      if (!id) return null;
      
      try {
        const apiUrl = this.getApiUrl();
        const urls = [
          `${apiUrl}/organization/${this.orgId}/v2/business-hours/${id}`,
          `${apiUrl}/organization/${this.orgId}/business-hours/${id}`
        ];
        let data = null;

        for (const url of urls) {
          const response = await fetch(
            url,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
              }
            }
          );

          if (response.ok) {
            data = await response.json();
            break;
          }

          if (response.status !== 404) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
          }
        }

        if (!data) {
          throw new Error('API Error: 404 Not Found');
        }

        return {
          id: data.id,
          name: data.name || 'Business Hours',
          variableType: 'business_hours',
          timezone: data.timeZone ?? data.timezone ?? '',
          workingHours: Array.isArray(data.workingHours) ? data.workingHours : [],
          holidaysId: data.holidaysId || '',
          overridesId: data.overridesId || '',
          raw: data
        };
      } catch (err) {
        console.error('Error loading business hours:', err);
        return null;
      }
    }

    async loadFirstBusinessHoursId() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/v2/business-hours?page=0&pageSize=100`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const items = Array.isArray(data.data) ? data.data : [];
        if (!items.length) return null;

        const nameToMatch = (this.businessHoursConfig && this.businessHoursConfig.name) || '';
        if (nameToMatch) {
          const match = items.find(i => i && i.name === nameToMatch);
          if (match && match.id) return match.id;
        }

        return items[0].id || null;
      } catch (error) {
        console.error('Error loading business hours list:', error);
        return null;
      }
    }

    async loadAllBusinessHoursList() {
      try {
        const apiUrl = this.getApiUrl();
        const response = await fetch(
          `${apiUrl}/organization/${this.orgId}/v2/business-hours?page=0&pageSize=100`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Accept': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data.data) ? data.data : [];
      } catch (error) {
        console.error('Error loading business hours list:', error);
        return [];
      }
    }
    
    renderVariables() {
      const container = this.shadowRoot.getElementById('variablesContainer');
      
      const items = this.getAllItems();
      if (items.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📋</div><p>No variables configured.</p></div>';
        return;
      }
      
      // Separate items by type for organized layout
      const stringVars = items.filter(v => v.variableType === 'string');
      const booleanVars = items.filter(v => v.variableType === 'boolean');
      const overrideItem = items.find(v => v.variableType === 'override');
      const businessHoursItem = items.find(v => v.variableType === 'business_hours');
      
      const sections = [];
      if (businessHoursItem || overrideItem) {
        sections.push(`
          <div class="calendar-grid">
            ${businessHoursItem ? this.createVariableCard(businessHoursItem) : ''}
            ${overrideItem ? this.createVariableCard(overrideItem) : ''}
          </div>
        `);
      }

      if (stringVars.length) {
        if (sections.length) sections.push('<hr class="section-divider">');
        sections.push(`
          <div class="string-grid">
            ${stringVars.map(v => this.createVariableCard(v)).join('')}
          </div>
        `);
      }

      if (booleanVars.length) {
        if (sections.length) sections.push('<hr class="section-divider">');
        sections.push(`
          <div class="boolean-grid">
            ${booleanVars.map(v => this.createVariableCard(v)).join('')}
          </div>
        `);
      }

      container.innerHTML = `
        <div class="variables-grid">
          ${sections.join('')}
        </div>
      `;
      
      this.attachCardEventListeners(container);
    }
    
    attachCardEventListeners(container) {
      // Cancel button
      container.querySelectorAll('[data-action="cancel-edit"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.editingVariableName = null;
          this.businessHoursError = '';
          this.overrideError = '';
          this.renderVariables();
        });
      });

      // Action buttons (edit/save)
      container.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const state = e.currentTarget.dataset.state;
          if (state === 'check') return;
          
          const varId = e.currentTarget.dataset.id;
          const varType = e.currentTarget.dataset.type;
          const variable = this.getAllItems().find(v => v.id === varId);
          if (!variable) return;
          
          if (state === 'edit') {
            this.editingVariableName = varId;
            this.renderVariables();
            return;
          }
          
          // Save action
          const card = e.currentTarget.closest('.variable-card');
          if (varType === 'override' && card) {
            this.saveOverrideInline(varId, card);
          } else if (varType === 'business_hours' && card) {
            this.saveBusinessHoursInline(varId, card);
          } else {
            const textarea = card ? card.querySelector('.edit-value') : null;
            const newVal = textarea ? textarea.value : '';
            this.saveVariableInline(varId, newVal);
          }
        });
      });

      // Boolean toggles
      container.querySelectorAll('.bool-toggle').forEach(chk => {
        chk.addEventListener('change', (e) => {
          const varId = e.currentTarget.dataset.id;
          const newVal = e.currentTarget.checked ? 'true' : 'false';
          this.saveVariableInline(varId, newVal);
        });
      });

      container.querySelectorAll('[data-action="add-shift"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const wrapper = e.currentTarget.closest('.business-hours-shifts');
          if (!wrapper) return;
          const index = wrapper.querySelectorAll('.business-hours-shift').length;
          const row = this.renderBusinessHoursShiftRow({ name: '', days: [], startTime: '', endTime: '' }, index);
          e.currentTarget.insertAdjacentHTML('beforebegin', row);
          const newRow = e.currentTarget.previousElementSibling;
          const removeBtn = newRow ? newRow.querySelector('[data-action="remove-shift"]') : null;
          if (removeBtn) {
            removeBtn.addEventListener('click', (evt) => {
              const rowEl = evt.currentTarget.closest('.business-hours-shift');
              if (rowEl) rowEl.remove();
            });
          }
        });
      });

      container.querySelectorAll('[data-action="remove-shift"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const row = e.currentTarget.closest('.business-hours-shift');
          if (row) row.remove();
        });
      });

      container.querySelectorAll('[data-action="add-override"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const wrapper = e.currentTarget.closest('.business-hours-shifts');
          if (!wrapper) return;
          const index = wrapper.querySelectorAll('.business-hours-shift').length;
          const row = this.renderOverrideRow({ name: '', startDateTime: '', endDateTime: '', workingHours: true }, index);
          e.currentTarget.insertAdjacentHTML('beforebegin', row);
          const newRow = e.currentTarget.previousElementSibling;
          const removeBtn = newRow ? newRow.querySelector('[data-action="remove-override"]') : null;
          if (removeBtn) {
            removeBtn.addEventListener('click', (evt) => {
              const rowEl = evt.currentTarget.closest('.business-hours-shift');
              if (rowEl) rowEl.remove();
            });
          }
          // Add listener for the working toggle in new row
          const workingToggle = newRow ? newRow.querySelector('.override-row-working') : null;
          if (workingToggle) {
            workingToggle.addEventListener('change', (evt) => {
              const label = evt.target.closest('label');
              if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = evt.target.checked ? 'Enabled' : 'Disabled';
              }
            });
          }
        });
      });

      container.querySelectorAll('[data-action="remove-override"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const row = e.currentTarget.closest('.business-hours-shift');
          if (row) row.remove();
        });
      });

      // Handle override-row-working toggle label updates
      container.querySelectorAll('.override-row-working').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
          const label = e.target.closest('label');
          if (label) {
            const span = label.querySelector('span');
            if (span) span.textContent = e.target.checked ? 'Enabled' : 'Disabled';
          }
        });
      });

      // Handle business hours dropdown change
      container.querySelectorAll('[data-action="change-business-hours"]').forEach(select => {
        select.addEventListener('change', async (e) => {
          const newId = e.target.value;
          if (!newId) return;
          
          // Update the config and reload
          if (!this.businessHoursConfig) this.businessHoursConfig = {};
          this.businessHoursConfig.id = newId;
          
          const businessHours = await this.loadBusinessHoursById(newId);
          if (businessHours) {
            businessHours.displayName = businessHours.name || 'Business Hours';
            this.businessHoursEntry = businessHours;
            this.renderVariables();
          }
        });
      });

      // Toggle the read-only holiday-list detail panel
      container.querySelectorAll('[data-action="toggle-holiday-details"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const holidayId = e.currentTarget.dataset.holidayId;
          this.expandedHolidayListId = (this.expandedHolidayListId === holidayId) ? null : holidayId;
          this.renderVariables();
        });
      });

      // Handle override dropdown change
      container.querySelectorAll('[data-action="change-override"]').forEach(select => {
        select.addEventListener('change', async (e) => {
          const newId = e.target.value;
          if (!newId) return;
          
          // Update the config and reload
          if (!this.overrideConfig) this.overrideConfig = {};
          this.overrideConfig.id = newId;
          
          const override = await this.loadOverrideById();
          if (override) {
            override.displayName = override.name || 'Override Hours';
            this.overrideEntry = override;
            this.renderVariables();
          }
        });
      });

    }
    
    createVariableCard(variable) {
      const displayName = this.formatDisplayName(variable.displayName || variable.name || variable.variableName || 'Variable');
      const type = (variable.variableType || '').toLowerCase();
      const isBoolean = type === 'boolean';
      const isOverride = type === 'override';
      const isBusinessHours = type === 'business_hours';
      const value = (variable.value || variable.variableValue || variable.defaultValue || '');
      
      const editKey = variable.id;
      const isEditing = !isBoolean && this.editingVariableName === editKey;
      const showSuccess = !!this.successFlags[editKey];
      
      const overrideMsgVar = this.getOverrideMessageVariable();
      const overrideMsgVal = overrideMsgVar ? (overrideMsgVar.value || overrideMsgVar.variableValue || overrideMsgVar.defaultValue || '') : '';

      const hasOpenPopover = isBusinessHours && !!this.expandedHolidayListId && variable.holidaysId === this.expandedHolidayListId;

      return `
        <div class="variable-card ${isEditing ? 'editing' : ''} ${hasOpenPopover ? 'popover-open' : ''}">
          <div class="variable-header">
            <div class="variable-name">${this.escapeHtml(displayName)}</div>
            <div style="display:flex;gap:6px;align-items:center;">
              ${this.renderActionButton(isBoolean, isEditing, showSuccess, isOverride, isBusinessHours, variable.id)}
              ${isEditing && !isBoolean ? `
                <button class="icon-btn cancel-btn" 
                        data-action="cancel-edit"
                        data-id="${this.escapeHtml(variable.id)}" 
                        title="Cancel" 
                        style="padding:8px;font-size:18px;color:#ef4444;">✕</button>
              ` : ''}
            </div>
          </div>
          ${this.renderVariableContent(variable, isBoolean, isOverride, isBusinessHours, isEditing, value, overrideMsgVar, overrideMsgVal)}
        </div>
      `;
    }
    
    renderActionButton(isBoolean, isEditing, showSuccess, isOverride, isBusinessHours, varId) {
      if (isBoolean) return '';
      
      const buttonState = showSuccess ? 'check' : (isEditing ? 'save' : 'edit');
      const icon = buttonState === 'save' ? '💾' : (buttonState === 'check' ? '✓' : '✏️');
      const title = buttonState === 'save' ? 'Save' : (buttonState === 'check' ? 'Saved' : 'Edit');
      const disabled = buttonState === 'check' ? 'disabled' : '';
      const type = isOverride ? 'override' : (isBusinessHours ? 'business_hours' : 'text');
      
      if (isEditing) {
        return `
          <button class="icon-btn action-btn" 
                  data-state="save" 
                  data-type="${type}" 
                  data-id="${this.escapeHtml(varId)}" 
                  title="Save" 
                  style="padding:4px 6px;">💾</button>
        `;
      }
      
      return `<button class="icon-btn action-btn" 
                      data-state="${buttonState}" 
                      data-type="${type}" 
                      data-id="${this.escapeHtml(varId)}" 
                      title="${title}" 
                      style="padding:4px 6px;" 
                      ${disabled}>${icon}</button>`;
    }
    
    renderVariableContent(variable, isBoolean, isOverride, isBusinessHours, isEditing, value, overrideMsgVar, overrideMsgVal) {
      if (isBoolean) {
        return this.renderBooleanContent(variable, value);
      }
      
      if (isOverride) {
        return this.renderOverrideContent(variable, isEditing, overrideMsgVar, overrideMsgVal);
      }

      if (isBusinessHours) {
        return this.renderBusinessHoursContent(variable, isEditing);
      }
      
      return this.renderTextContent(value, isEditing);
    }
    
    renderBooleanContent(variable, value) {
      const checked = value === 'true' || value === true;
      return `
        <label style="display:flex;align-items:center;gap:10px;font-weight:600;color:var(--card-text);">
          <div class="switch">
            <input type="checkbox" 
                   class="bool-toggle" 
                   data-id="${this.escapeHtml(variable.id)}" 
                   ${checked ? 'checked' : ''}>
            <span class="slider"></span>
          </div>
          <span>${checked ? 'On' : 'Off'}</span>
        </label>
      `;
    }
    
    renderOverrideContent(variable, isEditing, overrideMsgVar, overrideMsgVal) {
      const raw = variable.raw || {};
      const overrides = raw.overrides || [];
      
      // Dropdown for selecting different overrides
      const dropdownMarkup = (this.overridesList && this.overridesList.length > 1) ? `
        <div style="margin-bottom:12px;">
          <select class="calendar-select" data-action="change-override">
            ${this.overridesList.map(ov => `
              <option value="${this.escapeHtml(ov.id)}" ${ov.id === variable.id ? 'selected' : ''}>
                ${this.escapeHtml(ov.name || 'Override Hours')}
              </option>
            `).join('')}
          </select>
        </div>
      ` : '';
      
      const overrideErrorMarkup = this.overrideError
        ? `<div class="message error" style="margin-bottom:0;">${this.escapeHtml(this.overrideError)}</div>`
        : '';

      if (isEditing) {
        return `
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${overrideErrorMarkup}
            ${dropdownMarkup}
            <div class="business-hours-shifts">
              ${overrides.map((ov, idx) => this.renderOverrideRow(ov, idx)).join('')}
              <button class="shift-add" type="button" data-action="add-override">Add Override</button>
            </div>
            ${overrideMsgVar ? `
              <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
                <label style="font-weight:600;color:var(--card-text);">Override Message</label>
                <textarea class="inline-textarea override-msg">${this.escapeHtml(overrideMsgVal)}</textarea>
              </div>
            ` : ''}
          </div>
        `;
      }
      
      // View mode - show all overrides
      const hasOverrides = overrides.length > 0;
      
      return `
        <div>
          ${dropdownMarkup}
          ${hasOverrides ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${overrides.map((ov, idx) => `
                <div style="background:var(--chip-bg);border:1px solid var(--chip-border);border-radius:8px;padding:10px;">
                  <div style="font-weight:600;color:var(--card-text);margin-bottom:6px;">${this.escapeHtml(ov.name || `Override ${idx + 1}`)}</div>
                  <div style="font-size:13px;color:var(--muted-text);display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
                    <span>📅 ${this.escapeHtml(this.formatDateTime(ov.startDateTime))}</span>
                    <span>→</span>
                    <span>📅 ${this.escapeHtml(this.formatDateTime(ov.endDateTime))}</span>
                    <span class="status-pill ${ov.workingHours ? 'status-pill-on' : 'status-pill-off'}">
                      ${ov.workingHours ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="color:var(--muted-text);font-style:italic;">No overrides configured</div>
          `}
          ${(overrideMsgVar && hasOverrides && overrides.some(ov => ov.workingHours)) ? `
            <div style="width:100%;display:flex;flex-direction:column;gap:6px;margin-top:10px;">
              <div style="font-weight:700;color:var(--title-text);">Override Message</div>
              <div class="override-message-view">
                <div class="message-value">${this.escapeHtml(overrideMsgVal)}</div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    renderOverrideRow(override = {}, index = 0) {
      const name = override.name || '';
      const startDateTime = override.startDateTime || '';
      const endDateTime = override.endDateTime || '';
      const workingHours = override.workingHours !== undefined ? override.workingHours : true;
      
      const startDate = this.toLocalDate(startDateTime);
      const startTime = this.toLocalTime(startDateTime);
      const endDate = this.toLocalDate(endDateTime);
      const endTime = this.toLocalTime(endDateTime);
      
      return `
        <div class="business-hours-shift" data-index="${index}">
          <input class="business-hours-input override-name" type="text" placeholder="Override name" value="${this.escapeHtml(name)}">
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:12px;color:var(--muted-text);">Start Date</label>
              <input type="date" class="business-hours-input override-start-date" value="${this.escapeHtml(startDate)}">
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:12px;color:var(--muted-text);">Start Time</label>
              <input type="time" class="business-hours-input override-start-time" value="${this.escapeHtml(startTime)}">
            </div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start;">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:12px;color:var(--muted-text);">End Date</label>
              <input type="date" class="business-hours-input override-end-date" value="${this.escapeHtml(endDate)}">
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <label style="font-size:12px;color:var(--muted-text);">End Time</label>
              <input type="time" class="business-hours-input override-end-time" value="${this.escapeHtml(endTime)}">
            </div>
          </div>
          <label class="override-toggle">
            <div class="switch">
              <input type="checkbox" class="override-row-working" ${workingHours ? 'checked' : ''}>
              <span class="slider"></span>
            </div>
            <span>${workingHours ? 'Enabled' : 'Disabled'}</span>
          </label>
          <button class="shift-remove" type="button" data-action="remove-override">Remove</button>
        </div>
      `;
    }

    renderBusinessHoursContent(variable, isEditing) {
      const dayMap = this.getBusinessHoursDayMap(variable.workingHours || []);
      const dayOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const errorMarkup = this.businessHoursError
        ? `<div class="message error" style="margin-bottom:10px;">${this.escapeHtml(this.businessHoursError)}</div>`
        : '';
      
      // Dropdown for selecting different business hours
      const dropdownMarkup = (this.businessHoursList && this.businessHoursList.length > 1) ? `
        <select class="calendar-select" data-action="change-business-hours">
          ${this.businessHoursList.map(bh => `
            <option value="${this.escapeHtml(bh.id)}" ${bh.id === variable.id ? 'selected' : ''}>
              ${this.escapeHtml(bh.name || 'Business Hours')}
            </option>
          `).join('')}
        </select>
      ` : '';

      const linkedRefsMarkup = this.renderLinkedReferences(variable);

      const topRow = (dropdownMarkup || linkedRefsMarkup) ? `
        <div class="business-hours-top-row">
          ${dropdownMarkup}
          ${linkedRefsMarkup}
        </div>
      ` : '';

      if (isEditing) {
        const shifts = Array.isArray(variable.workingHours) ? variable.workingHours : [];
        return `
          ${topRow}
          ${errorMarkup}
          <div class="business-hours-shifts">
            ${shifts.map((shift, index) => this.renderBusinessHoursShiftRow(shift, index)).join('')}
            <button class="shift-add" type="button" data-action="add-shift">Add Shift</button>
          </div>
        `;
      }

      return `
        ${topRow}
        ${errorMarkup}
        <div class="business-hours-grid">
          ${dayOrder.map(day => {
            const entries = dayMap[day] || [];
            const label = entries.length
              ? entries.map(entry => {
                  const name = this.escapeHtml(entry.name || 'Shift');
                  const start = this.escapeHtml(this.formatTime12h(entry.startTime) || '--:--');
                  const end = this.escapeHtml(this.formatTime12h(entry.endTime) || '--:--');
                  return `${name} ${start}-${end}`;
                }).join('<br>')
              : 'Closed';
            return `
              <div class="business-hours-cell">
                <div class="business-hours-day">${day}</div>
                <div class="business-hours-time">${label}</div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Read-only summary of what's linked to this Business Hours calendar
    // (Holiday List, Override) — mirrors Control Hub's "Additional Settings".
    // Holiday List name is clickable to reveal its dates; nothing here is editable.
    renderLinkedReferences(variable) {
      const holidaysId = variable.holidaysId || '';
      const overridesId = variable.overridesId || '';
      const linkedHolidayList = holidaysId ? (this.holidayListsList || []).find(h => h.id === holidaysId) : null;
      const linkedOverride = overridesId ? (this.overridesList || []).find(o => o.id === overridesId) : null;

      if (!linkedHolidayList && !linkedOverride) return '';

      const isExpanded = linkedHolidayList && this.expandedHolidayListId === linkedHolidayList.id;

      return `
        <div class="linked-refs">
          ${linkedHolidayList ? `
            <button type="button" class="linked-ref-btn" data-action="toggle-holiday-details" data-holiday-id="${this.escapeHtml(linkedHolidayList.id)}">
              <span>Holiday List: <strong>${this.escapeHtml(linkedHolidayList.name || 'Holiday List')}</strong></span>
              <span class="linked-ref-caret">${isExpanded ? '▾' : '▸'}</span>
            </button>
            ${isExpanded ? `
              <div class="holiday-list-detail">
                ${(linkedHolidayList.holidays || []).length ? linkedHolidayList.holidays.map(h => `
                  <div class="holiday-row">
                    <span class="holiday-name">${this.escapeHtml(h.name || 'Holiday')}</span>
                    <span class="holiday-dates">${this.escapeHtml(this.formatCalendarDate(h.startDate))}${h.endDate && h.endDate !== h.startDate ? ' → ' + this.escapeHtml(this.formatCalendarDate(h.endDate)) : ''}${h.frequency ? ' · ' + this.escapeHtml(h.frequency) : ''}</span>
                  </div>
                `).join('') : '<div class="holiday-row"><span class="holiday-name">No holidays in this list</span></div>'}
              </div>
            ` : ''}
          ` : ''}
          ${linkedOverride ? `
            <div class="linked-ref-static">Override: <strong>${this.escapeHtml(linkedOverride.name || 'Override')}</strong></div>
          ` : ''}
        </div>
      `;
    }

    formatCalendarDate(dateStr) {
      if (!dateStr) return '';
      const [y, m, d] = String(dateStr).split('-').map(n => parseInt(n, 10));
      if (!y || !m || !d) return dateStr;
      const date = new Date(y, m - 1, d);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }

    renderBusinessHoursShiftRow(shift, index) {
      const dayOrder = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const days = Array.isArray(shift.days) ? shift.days : [];
      return `
        <div class="business-hours-shift" data-index="${index}">
          <input class="business-hours-input bh-shift-name" type="text" placeholder="Shift name" value="${this.escapeHtml(shift.name || '')}">
          <div class="shift-days">
            ${dayOrder.map(day => `
              <label>
                <input type="checkbox" class="bh-shift-day" value="${day}" ${days.includes(day) ? 'checked' : ''}>
                ${day}
              </label>
            `).join('')}
          </div>
          <input type="time" class="business-hours-input bh-shift-start" value="${this.escapeHtml(shift.startTime || '')}">
          <input type="time" class="business-hours-input bh-shift-end" value="${this.escapeHtml(shift.endTime || '')}">
          <button class="shift-remove" type="button" data-action="remove-shift">Remove</button>
        </div>
      `;
    }

    getBusinessHoursDayMap(workingHours) {
      const map = {};
      for (const block of workingHours || []) {
        const days = Array.isArray(block.days) ? block.days : [];
        for (const day of days) {
          if (!map[day]) map[day] = [];
          map[day].push({
            name: block.name || '',
            startTime: block.startTime || '',
            endTime: block.endTime || ''
          });
        }
      }
      return map;
    }
    
    renderTextContent(value, isEditing) {
      if (isEditing) {
        return `<textarea class="inline-textarea edit-value">${this.escapeHtml(value)}</textarea>`;
      }
      return `<div class="variable-value message-value">${this.escapeHtml(value)}</div>`;
    }
    
    getOverrideMessageVariable() {
      if (!this.overrideConfig || !this.overrideConfig.messageVarId) return null;
      return this.variables.find(v => v.id === this.overrideConfig.messageVarId);
    }

    async saveVariableInline(varId, newValue) {
      const variable = this.variables.find(v => v.id === varId);
      if (!variable) {
        this.showMessage('Variable not found', 'error');
        return;
      }
      
      try {
        const apiUrl = this.getApiUrl();
        const source = variable.raw || {};
        
        const payload = {
          ...source,
          id: varId,
          name: source.name || variable.name,
          defaultValue: newValue
        };

        const res = await fetch(`${apiUrl}/organization/${this.orgId}/cad-variable/${varId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const updated = await this.loadVariableById(varId);
        if (updated) {
          const idx = this.variables.findIndex(v => v.id === varId);
          if (idx >= 0) {
            updated.displayName = this.variables[idx].displayName;
            updated.variableType = this.variables[idx].variableType;
            this.variables[idx] = updated;
          }
        }
        
        this.markSuccess(varId);
        this.editingVariableName = null;
        this.renderVariables();
      } catch (error) {
        this.showMessage(`Error saving variable: ${error.message}`, 'error');
      }
    }

    async saveBusinessHoursInline(varId, card) {
      const entry = this.businessHoursEntry;
      if (!entry || entry.id !== varId) {
        this.showMessage('Business hours not found', 'error');
        return;
      }
      this.businessHoursError = '';

      const rows = Array.from(card.querySelectorAll('.business-hours-shift'));
      const workingHours = [];

      for (const row of rows) {
        const name = row.querySelector('.bh-shift-name')?.value?.trim() || '';
        const startTime = row.querySelector('.bh-shift-start')?.value || '';
        const endTime = row.querySelector('.bh-shift-end')?.value || '';
        const days = Array.from(row.querySelectorAll('.bh-shift-day:checked')).map(cb => cb.value);

        if (!name && !startTime && !endTime && days.length === 0) {
          continue;
        }
        if (!name || !startTime || !endTime || days.length === 0) {
          this.showMessage('Each shift needs a name, days, start, and end time', 'error');
          return;
        }
        if (startTime >= endTime) {
          this.showMessage(`Invalid time range ${startTime}-${endTime}`, 'error');
          return;
        }

        workingHours.push({
          name,
          days,
          startTime,
          endTime
        });
      }

      if (!workingHours.length) {
        this.showMessage('Business hours require at least one open day', 'error');
        return;
      }

      try {
        const apiUrl = this.getApiUrl();
        const source = entry.raw || {};
        const timezone = source.timeZone ?? source.timezone ?? entry.timezone ?? '';
        const tzKey = ('timeZone' in source) ? 'timeZone' : 'timezone';
        const payload = {
          ...source,
          organizationId: this.orgId,
          id: varId,
          name: source.name || entry.name || 'Business Hours',
          description: source.description || '',
          [tzKey]: timezone,
          workingHours
        };
        const urls = [
          `${apiUrl}/organization/${this.orgId}/v2/business-hours/${varId}`,
          `${apiUrl}/organization/${this.orgId}/business-hours/${varId}`
        ];
        let saved = false;

        for (const url of urls) {
          const res = await fetch(url, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (res.ok) {
            saved = true;
            break;
          }

          if (res.status !== 404) {
            const errText = await res.text();
            const parsed = this.parseBusinessHoursError(errText);
            throw new Error(parsed || `API Error: ${res.status} ${res.statusText}`);
          }
        }

        if (!saved) {
          throw new Error('API Error: 404 Not Found');
        }

        const updated = await this.loadBusinessHoursById(varId);
        if (updated) {
          updated.displayName = entry.displayName;
          this.businessHoursEntry = updated;
        }

        this.markSuccess(varId);
        this.businessHoursError = '';
        this.editingVariableName = null;
        this.renderVariables();
      } catch (error) {
        this.businessHoursError = error.message;
        this.renderVariables();
      }
    }

    parseBusinessHoursError(text) {
      if (!text) return '';
      try {
        const data = JSON.parse(text);
        if (data && data.error && data.error.reason) {
          return data.error.reason;
        }
        if (data && data.error && Array.isArray(data.error.message) && data.error.message[0]?.description) {
          return data.error.message[0].description;
        }
      } catch (err) {
        return text.trim();
      }
      return '';
    }

    async saveOverrideInline(varId, card) {
      this.overrideError = '';

      const entry = this.overrideEntry;
      if (!entry || entry.id !== varId) {
        this.showMessage('Override entry not found', 'error');
        return;
      }

      if (!card) {
        this.showMessage('Card element not found', 'error');
        return;
      }

      const rows = Array.from(card.querySelectorAll('.business-hours-shift'));
      const overrides = [];
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const position = i + 1; // 1-indexed for the user-facing message
        const name = row.querySelector('.override-name')?.value?.trim() || '';
        const startDate = row.querySelector('.override-start-date')?.value || '';
        const startTime = row.querySelector('.override-start-time')?.value || '';
        const endDate = row.querySelector('.override-end-date')?.value || '';
        const endTime = row.querySelector('.override-end-time')?.value || '';
        const working = row.querySelector('.override-row-working')?.checked || false;

        // Skip completely empty rows
        if (!name && !startDate && !endDate) {
          continue;
        }

        // Validate required fields
        if (!name || !startDate || !startTime || !endDate || !endTime) {
          this.overrideError = `Override #${position} needs a name, start date/time, and end date/time.`;
          this.renderVariables();
          return;
        }

        const startDateTime = this.toIsoLocal(startDate, startTime);
        const endDateTime = this.toIsoLocal(endDate, endTime);

        if (!startDateTime || !endDateTime) {
          this.overrideError = `Override #${position} has an invalid date/time format.`;
          this.renderVariables();
          return;
        }

        if (startDateTime >= endDateTime) {
          // Deliberately not naming the row here — its name field is
          // editable, so a name baked into this message can go stale the
          // moment the user types over it without re-saving. Position in
          // the list doesn't change on every keystroke, so it stays accurate.
          this.overrideError = `Override #${position}: end time must be after start time (it's currently set to end before, or at the same time as, it starts).`;
          this.renderVariables();
          return;
        }
        
        overrides.push({
          name,
          startDateTime,
          endDateTime,
          workingHours: working
        });
      }
      
      if (!overrides.length) {
        this.overrideError = 'At least one override is required.';
        this.renderVariables();
        return;
      }
      
      const msgTextarea = card.querySelector('.override-msg');
      const msgVal = msgTextarea ? msgTextarea.value : undefined;
      
      try {
        const apiUrl = this.getApiUrl();
        const source = entry.raw || {};
        const timezone = source.timeZone ?? source.timezone ?? entry.timezone ?? '';
        const tzKey = ('timeZone' in source) ? 'timeZone' : 'timezone';

        const payload = {
          ...source,
          organizationId: this.orgId,
          id: varId,
          name: source.name || entry.name || 'Override Hours',
          [tzKey]: timezone,
          overrides
        };

        const res = await fetch(`${apiUrl}/organization/${this.orgId}/overrides/${varId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
        
        const updated = await this.loadOverrideById();
        if (updated) {
          updated.displayName = entry.displayName;
          this.overrideEntry = updated;
        }
        
        if (msgVal !== undefined && this.overrideConfig && this.overrideConfig.messageVarId) {
          await this.saveVariableInline(this.overrideConfig.messageVarId, msgVal);
        }
        
        this.markSuccess(varId);
        this.overrideError = '';
        this.editingVariableName = null;
        this.renderVariables();
      } catch (err) {
        this.overrideError = err.message;
        this.renderVariables();
      }
    }

    async saveOverrideWorkingToggle(varId, working) {
      if (!this.overrideEntry || this.overrideEntry.id !== varId) return;
      const entry = this.overrideEntry;
      const raw = entry.raw || {};
      const overrides = raw.overrides || [];
      
      if (!overrides.length) {
        this.showMessage('No overrides to update', 'error');
        return;
      }

      try {
        const apiUrl = this.getApiUrl();
        const timezone = raw.timeZone ?? raw.timezone ?? entry.timezone ?? '';
        const tzKey = ('timeZone' in raw) ? 'timeZone' : 'timezone';
        const payload = {
          ...raw,
          organizationId: this.orgId,
          id: varId,
          name: raw.name || entry.name || 'Override Hours',
          [tzKey]: timezone,
          overrides: overrides.map(ov => ({
            ...ov,
            workingHours: working
          }))
        };

        const res = await fetch(`${apiUrl}/organization/${this.orgId}/overrides/${varId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const updated = await this.loadOverrideById();
        if (updated) {
          updated.displayName = entry.displayName;
          this.overrideEntry = updated;
        }

        this.markSuccess(varId);
        this.renderVariables();
      } catch (err) {
        this.showMessage(`Error updating override: ${err.message}`, 'error');
      }
    }

    formatDateTime(str) {
      if (!str) return '';
      const d = new Date(str);
      if (isNaN(d.getTime())) return str;
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    toLocalDate(str) {
      if (!str) return '';
      const d = new Date(str);
      if (isNaN(d.getTime())) return str;
      const pad = n => `${n}`.padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    toLocalTime(str) {
      if (!str) return '';
      const d = new Date(str);
      if (isNaN(d.getTime())) return '';
      const pad = n => `${n}`.padStart(2, '0');
      return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    toIsoLocal(dateStr, timeStr) {
      if (!dateStr) return '';
      const attempt = new Date(`${dateStr}T${timeStr || '00:00'}`);
      const asDate = isNaN(attempt.getTime()) ? this.parseLoose(dateStr, timeStr) : attempt;
      if (!asDate || isNaN(asDate.getTime())) return '';
      const pad = n => `${n}`.padStart(2, '0');
      return `${asDate.getFullYear()}-${pad(asDate.getMonth() + 1)}-${pad(asDate.getDate())}T${pad(asDate.getHours())}:${pad(asDate.getMinutes())}`;
    }

    parseLoose(dateStr, timeStr) {
      const parts = dateStr.split(/[\\/]/);
      if (parts.length === 3) {
        const [a, b, c] = parts.map(p => parseInt(p, 10));
        const year = c >= 1000 ? c : (c + 2000);
        const month = a > 12 ? b - 1 : a - 1;
        const day = a > 12 ? a : b;
        const [h = 0, m = 0] = (timeStr || '').split(':').map(v => parseInt(v, 10) || 0);
        return new Date(year, month, day, h, m);
      }
      return null;
    }

    formatTime12h(timeStr) {
      if (!timeStr) return '';
      const [hStr, mStr = '00'] = timeStr.split(':');
      const h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (Number.isNaN(h) || Number.isNaN(m)) return timeStr;
      const suffix = h >= 12 ? 'PM' : 'AM';
      const hour = h % 12 === 0 ? 12 : h % 12;
      return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
    }

    formatDisplayName(name) {
      if (!name) return '';
      return String(name).replace(/_/g, ' ').trim();
    }
    
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }
  
  if (!customElements.get('global-variable-manager')) {
    customElements.define('global-variable-manager', GlobalVariableManager);
    console.log('✅ Global Variable Manager v2.2.0 component registered successfully');
  } else {
    console.warn('⚠️ global-variable-manager already registered (possible duplicate script load)');
  }
})();

console.log('✅ Global Variable Manager v2.2.0 script loaded completely');
