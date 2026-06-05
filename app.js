document.addEventListener('DOMContentLoaded', () => {
    const typographyBtn = document.getElementById('typographyBtn');
    const displayText = document.getElementById('displayText');
    if (!typographyBtn || !displayText) return;
    let originalText = "四季遞嬗，日月更迭，唯有筆墨如石堅。";
    let typeState = 0;
    let currentFont = "Iansui";
    let currentFontSize = 20.0;
    let currentLetterSpacing = 0.0;
    let currentLineHeight = 1.3;
    let currentColor = "#2F241E";
    let circularRadius = 100.0;
    let circularSpacing = 15.0;
    let circularStartAngle = 0.0;
    let circularIsClockwise = true;
    let activeStrokeTab = 'box';
    let boxStrokeColor = "transparent";
    let boxStrokeWidth = 2.5;
    let pathStrokeColor = "transparent";
    let pathStrokeWidth = 2.5;
    let signStrokeColor = "transparent";
    let signStrokeWidth = 2.5;

    let activeTabId = null;
    const panels = {
        font: document.getElementById('fontPanel'),
        color: document.getElementById('colorPanel'),
        size: document.getElementById('sizePanel'),
        stroke: document.getElementById('strokePanel')
    };

    const btns = {
        keyboard: document.getElementById('keyboardBtn'),
        size: document.getElementById('sizeBtn'),
        color: document.getElementById('colorBtn'),
        stroke: document.getElementById('strokeBtn'),
        font: document.getElementById('fontBtn'),
        layout: document.getElementById('layoutBtn'),
        copy: document.getElementById('copyBtn')
    };

    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const lineHeightSlider = document.getElementById('lineHeightSlider');
    const letterSpacingSlider = document.getElementById('letterSpacingSlider');
    const radiusSlider = document.getElementById('radiusSlider');
    const circularSpacingSlider = document.getElementById('circularSpacingSlider');
    const angleSlider = document.getElementById('angleSlider');
    const strokeWidthSlider = document.getElementById('strokeWidthSlider');
    
    const fontSizeValue = document.getElementById('fontSizeValue');
    const lineHeightValue = document.getElementById('lineHeightValue');
    const letterSpacingValue = document.getElementById('letterSpacingValue');
    const radiusValue = document.getElementById('radiusValue');
    const circularSpacingValue = document.getElementById('circularSpacingValue');
    const angleValue = document.getElementById('angleValue');
    const strokeWidthValue = document.getElementById('strokeWidthValue');

    const standardSizeControls = document.getElementById('standardSizeControls');
    const circularControls = document.getElementById('circularControls');
    const cwBtn = document.getElementById('cwBtn');
    const ccwBtn = document.getElementById('ccwBtn');
    const lineHeightLabel = document.getElementById('lineHeightLabel');
    const strokeValueLabel = document.querySelector('#strokePanel .slider-label-row label');

    const fontDropdown = document.getElementById('fontDropdown');
    const activeFontHeader = document.getElementById('activeFontHeader');
    const currentFontName = document.getElementById('currentFontName');

    const typeIcons = [
        './imgs/icons/t01.png',
        './imgs/icons/t02.png',
        './imgs/icons/t03.png',
        './imgs/icons/t04.png',
        './imgs/icons/t05.png',
        './imgs/icons/t06.png'
    ];

    const strokePaletteByTextColor = {
        '#2f241e': ['#F2D6BF', '#A9C4E5', '#F1E6A4', '#C8DDB2'],
        '#f3e9d2': ['#5D4037', '#355070', '#4A6A3A', '#7F4F24'],
        '#3f5c3a': ['#DDE9C8', '#F4D7B5', '#BFD8F2', '#EADCB5'],
        '#7a2e2e': ['#F8D3CC', '#F9E6BA', '#C6DDF2', '#D7E8C7'],
        '#ffffff': ['#5D4037', '#34495E', '#6B7F3A', '#8E5A3C']
    };
    const defaultStrokePalette = strokePaletteByTextColor['#2f241e'];


    function initHeaderStyles() {
        if (currentFontName) {
            currentFontName.style.fontFamily = currentFont;
        }
    }

    function resetStrokeVisualStyles() {
        displayText.style.backgroundColor = 'transparent';
        displayText.style.border = 'none';
        displayText.style.borderRadius = '8px';
        displayText.style.padding = '2px 8px';
        displayText.style.display = 'inline';
        displayText.style.writingMode = 'horizontal-tb';
        displayText.style.webkitWritingMode = 'horizontal-tb';
        displayText.style.textOrientation = 'mixed';
        displayText.style.flexDirection = 'row';
        displayText.style.alignItems = 'center';
        displayText.style.justifyContent = 'center';
        displayText.style.maxWidth = 'none';
        displayText.style.maxHeight = 'none';
        displayText.style.width = 'auto';
        displayText.style.height = 'auto';
        displayText.style.overflow = 'visible';
        displayText.style.overflowX = 'visible';
        displayText.style.overflowY = 'visible';
        displayText.style.boxDecorationBreak = 'clone';
        displayText.style.webkitBoxDecorationBreak = 'clone';
        displayText.style.webkitTextStroke = '0px transparent';
        displayText.style.paintOrder = 'normal';
        displayText.style.strokeLinejoin = 'round';
        displayText.style.strokeLinecap = 'round';
        displayText.style.textRendering = 'auto';
    }

    function getActiveStrokeColor() {
        if (activeStrokeTab === 'box') return boxStrokeColor;
        if (activeStrokeTab === 'path') return pathStrokeColor;
        return signStrokeColor;
    }

    function setActiveStrokeColor(color) {
        if (activeStrokeTab === 'box') {
            boxStrokeColor = color;
        } else if (activeStrokeTab === 'path') {
            pathStrokeColor = color;
        } else {
            signStrokeColor = color;
        }
    }

    function syncStrokeSwatchActiveState() {
        const targetColor = (getActiveStrokeColor() || 'transparent').toLowerCase();
        const noneSwatch = document.querySelector('#strokeColorRow .color-swatch.none');
        const swatches = document.querySelectorAll('#strokeColorRow .color-swatch');

        swatches.forEach((s) => s.classList.remove('active'));

        if (targetColor === 'transparent') {
            if (noneSwatch) noneSwatch.classList.add('active');
            return;
        }

        const matched = Array.from(swatches).find((s) => {
            const c = s.getAttribute('data-color');
            return c && c.toLowerCase() === targetColor;
        });

        if (matched) {
            matched.classList.add('active');
            return;
        }

        if (noneSwatch) noneSwatch.classList.add('active');
    }

    function updateStrokePaletteByTextColor(forceFallback = false) {
        const key = (currentColor || '').toLowerCase();
        const palette = strokePaletteByTextColor[key] || defaultStrokePalette;
        const paletteSwatches = Array.from(document.querySelectorAll('#strokeColorRow .color-swatch:not(.none):not(.custom)'));

        paletteSwatches.forEach((swatch, index) => {
            const color = palette[index % palette.length];
            swatch.style.background = color;
            swatch.setAttribute('data-color', color);
        });

        const currentStrokeColor = getActiveStrokeColor();
        const existsInPalette = palette.some((c) => c.toLowerCase() === (currentStrokeColor || '').toLowerCase());
        if (currentStrokeColor !== 'transparent' && !existsInPalette && forceFallback) {
            setActiveStrokeColor(palette[0]);
        }

        syncStrokeSwatchActiveState();
    }

    function togglePanel(tabId) {
        Object.values(btns).forEach(b => b?.classList.remove('active'));
        
        if (activeTabId === tabId) {
            if (panels[tabId]) panels[tabId].style.display = 'none';
            activeTabId = null;
        } else {
            Object.values(panels).forEach(p => p.style.display = 'none');
            if (panels[tabId]) {
                panels[tabId].style.display = 'block';
                if (tabId === 'stroke' && typeState === 5) {
                    const pathTab = document.querySelector('#strokePanel [data-tab="path"]');
                    if (pathTab) pathTab.click();
                }

                activeTabId = tabId;
                if (btns[tabId]) btns[tabId].classList.add('active');
            }
        }
    }

    function applyStyles() {
        if (!displayText) return;
        const textArea = document.getElementById('textEditorArea');
        displayText.style.display = 'none';
        displayText.offsetHeight; 
        if (typeState === 5 || typeState === 4) {
            displayText.style.display = 'flex';
            if (textArea) textArea.style.display = 'flex';
        } else {
            displayText.style.display = 'inline';
            if (textArea) {
                textArea.style.display = 'block';
                textArea.style.textAlign = ['left', 'center', 'right', 'justify'][typeState] || 'center';
            }
        }
        resetStrokeVisualStyles();
        displayText.style.lineHeight = currentLineHeight;
        displayText.style.letterSpacing = currentLetterSpacing + "px";
        displayText.style.textAlign = "center";
        displayText.style.color = currentColor;
        displayText.style.fontSize = currentFontSize + "px";
        displayText.style.fontFamily = currentFont;
        displayText.style.fontWeight = "normal";

        if (textArea) {
            textArea.style.height = '';
            textArea.style.overflow = '';
            textArea.style.alignItems = 'center';
        }

        if (textArea) {
            const normalizedColor = (currentColor || '').toLowerCase();
            const needsDarkBackground = normalizedColor === "#ffffff";
            if (needsDarkBackground) {
                textArea.classList.add('dark-editor');
            } else {
                textArea.classList.remove('dark-editor');
            }
        }
        if (activeStrokeTab === 'box') {
            if (boxStrokeColor !== 'transparent') {
                displayText.style.backgroundColor = boxStrokeColor;
                displayText.style.border = `${boxStrokeWidth}px solid ${boxStrokeColor}`;
            }
        } else if (activeStrokeTab === 'sign') {
            displayText.style.display = 'inline-block';
            displayText.style.writingMode = 'horizontal-tb';
            displayText.style.webkitWritingMode = 'horizontal-tb';
            displayText.style.textOrientation = 'mixed';
            displayText.style.flexDirection = 'row';
            displayText.style.alignItems = 'center';
            displayText.style.justifyContent = 'center';
            displayText.style.maxWidth = '100%';
            displayText.style.padding = "8px";
            displayText.style.borderRadius = `${signStrokeWidth}px`;
            displayText.style.boxDecorationBreak = 'slice';
            displayText.style.webkitBoxDecorationBreak = 'slice';
            if (signStrokeColor === 'transparent') {
                displayText.style.backgroundColor = "transparent";
                displayText.style.border = "none";
            } else {
                displayText.style.backgroundColor = signStrokeColor;
                displayText.style.border = "none";
            }
        }

        if (activeStrokeTab === 'path') {
            if (pathStrokeColor === 'transparent') {
                displayText.style.webkitTextStroke = "0px transparent";
            } else {
                displayText.style.paintOrder = "stroke fill";
                displayText.style.strokeLinejoin = "round";
                displayText.style.strokeLinecap = "round";
                displayText.style.textRendering = 'geometricPrecision';
                displayText.style.webkitTextStroke = `${pathStrokeWidth}px ${pathStrokeColor}`;
            }
        }
        if (standardSizeControls) standardSizeControls.style.display = typeState === 5 ? 'none' : 'block';
        if (circularControls) circularControls.style.display = typeState === 5 ? 'block' : 'none';
        if (lineHeightLabel) lineHeightLabel.innerText = typeState === 4 ? '行距' : '行高';
        const boxTab = document.querySelector('#strokePanel [data-tab="box"]');
        const signTab = document.querySelector('#strokePanel [data-tab="sign"]');
        const pathTab = document.querySelector('#strokePanel [data-tab="path"]');
        if (boxTab && signTab) {
            boxTab.style.display = typeState === 5 ? 'none' : 'block';
            signTab.style.display = typeState === 5 ? 'none' : 'block';
            if (typeState === 5 && activeStrokeTab !== 'path') {
                if (pathTab) pathTab.click();
            }
        }
        if (strokeValueLabel) {
            strokeValueLabel.innerText = activeStrokeTab === 'sign' ? '圓角' : '粗細';
        }
        if (typeState === 5) {
            displayText.style.border = "none";
            displayText.style.backgroundColor = "transparent";
            
            const r = circularRadius;
            const startAngle = circularStartAngle;
            const textToRenderBase = originalText || "請輸入文字";
            const textToRender = circularIsClockwise
                ? textToRenderBase
                : textToRenderBase.split("").reverse().join("");
            
            const padding = Math.max(pathStrokeWidth * 2, 30);
            const contentSize = (r + currentFontSize * 1.2) * 2;
            const canvasSize = contentSize + padding;
            const center = canvasSize / 2;
            
            const svgContent = `
            <svg viewBox="0 0 ${canvasSize} ${canvasSize}" 
                 style="width: ${canvasSize}px; max-width: 100%; height: auto; overflow: visible; display: block; margin: auto; text-rendering: optimizeLegibility;">
                <defs>
                    <path id="circlePath" d="M ${center},${center - r} A ${r},${r} 0 1,1 ${center-0.1},${center - r}" />
                </defs>
                <g transform="rotate(${startAngle}, ${center}, ${center})">
                    <text font-family="${currentFont}" 
                          font-weight="normal" 
                          font-size="${currentFontSize}" 
                          fill="${currentColor}" 
                          stroke="${pathStrokeColor}" 
                          stroke-width="${pathStrokeColor === 'transparent' ? 0 : pathStrokeWidth}"
                          stroke-linejoin="round"
                          paint-order="stroke fill"
                          dominant-baseline="central"
                          text-anchor="middle">
                        <textPath xlink:href="#circlePath" startOffset="50%">
                            <tspan dy="${currentFontSize * 0.1}">${textToRender}</tspan>
                        </textPath>
                    </text>
                </g>
            </svg>`;
            
            displayText.innerHTML = svgContent;
            displayText.style.display = 'flex';
            displayText.style.justifyContent = 'center';
            displayText.style.alignItems = 'center';
            displayText.style.backgroundColor = 'transparent'; 
            const svgTextElement = displayText.querySelector('text');
            if (svgTextElement) {
                svgTextElement.style.letterSpacing = (circularSpacing / 10) + "em";
            }

        } else {
            if (displayText.querySelector('svg')) {
                displayText.innerText = originalText;
            }

            switch (typeState) {
                case 0: displayText.style.textAlign = 'left'; break;
                case 1: displayText.style.textAlign = 'center'; break;
                case 2: displayText.style.textAlign = 'right'; break;
                case 3: displayText.style.textAlign = 'justify'; break;
                case 4: 
                    displayText.style.writingMode = 'vertical-rl';
                    displayText.style.webkitWritingMode = 'vertical-rl';
                    displayText.style.textOrientation = 'upright';
                    displayText.style.textAlign = 'left';
                    displayText.style.height = '100%';
                    displayText.style.maxHeight = '100%';
                    displayText.style.display = 'flex';
                    displayText.style.flexDirection = 'column';
                    displayText.style.alignItems = 'center';
                    displayText.style.justifyContent = 'flex-start';
                    displayText.style.overflowY = 'auto';
                    displayText.style.overflowX = 'hidden';
                    displayText.style.boxDecorationBreak = 'slice';
                    displayText.style.webkitBoxDecorationBreak = 'slice';
                    if (textArea) {
                        textArea.style.height = '300px';
                        textArea.style.overflow = 'hidden';
                        textArea.style.alignItems = 'flex-start';
                    }
                    break;
            }
            if (typeState !== 4) {
                if (activeStrokeTab !== 'sign') {
                    displayText.style.boxDecorationBreak = 'clone';
                    displayText.style.webkitBoxDecorationBreak = 'clone';
                }
                displayText.style.overflowY = 'visible';
                displayText.style.overflowX = 'visible';
            } else if (activeStrokeTab === 'sign') {
                displayText.style.height = 'auto';
                displayText.style.maxHeight = 'none';
                displayText.style.overflowY = 'visible';
                displayText.style.overflowX = 'visible';
            }
        }
        if (typographyBtn) typographyBtn.src = typeIcons[typeState];
    }

    if (btns.keyboard) {
        btns.keyboard.addEventListener('click', () => {
            displayText.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(displayText);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        });
    }

    if (btns.size) btns.size.addEventListener('click', () => togglePanel('size'));
    if (btns.color) btns.color.addEventListener('click', () => togglePanel('color'));
    if (btns.stroke) btns.stroke.addEventListener('click', () => togglePanel('stroke'));
    if (btns.font) btns.font.addEventListener('click', () => togglePanel('font'));

    if (btns.layout) {
        btns.layout.addEventListener('click', (e) => {
            if (typeState !== 5) {
                originalText = displayText.innerText.trim() || originalText;
            }
            typeState = (typeState + 1) % 6;
            applyStyles();
        });
    }

    if (btns.copy) {
        btns.copy.addEventListener('click', () => {
            const text = typeState === 5 ? originalText : displayText.innerText;
            navigator.clipboard.writeText(text).then(() => {
                if (window.openPageModal) {
                    window.openPageModal('gotodownload.html');
                }
            });
        });
    }

    document.querySelectorAll('.font-item').forEach(item => {
        item.addEventListener('click', () => {
            if (typeState !== 5 && displayText) {
                originalText = displayText.innerText.trim() || originalText;
            }
            
            currentFont = item.dataset.font || "Iansui";
            if (currentFontName) {
                currentFontName.innerText = item.innerText;
                currentFontName.style.fontFamily = currentFont;
            }
            if (document.fonts) {
                document.fonts.load(`1em ${currentFont}`).then(() => applyStyles());
            } else {
                applyStyles();
            }
            
            if (fontDropdown) fontDropdown.style.display = 'none';
        });
    });

    if (activeFontHeader) {
        activeFontHeader.addEventListener('click', () => {
            if (fontDropdown) {
                fontDropdown.style.display = fontDropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }

    document.querySelectorAll('#colorPanel .color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
            if (sw.classList.contains('custom')) {
                if (window.openPageModal) {
                    window.openPageModal('gotodownload.html');
                }
                return;
            }
            document.querySelectorAll('#colorPanel .color-swatch').forEach(s => s.classList.remove('active'));
            sw.classList.add('active');
            currentColor = sw.dataset.color || "#000000";
            updateStrokePaletteByTextColor(true);
            applyStyles();
        });
    });

    document.querySelectorAll('#strokePanel .tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#strokePanel .tab-item').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeStrokeTab = tab.dataset.tab;

            if (activeStrokeTab === 'box') {
                boxStrokeColor = 'transparent';
            }
            
            const currentVal = activeStrokeTab === 'box'
                ? boxStrokeWidth
                : activeStrokeTab === 'path'
                    ? pathStrokeWidth
                    : signStrokeWidth;
            if (strokeWidthSlider) strokeWidthSlider.value = currentVal;
            if (strokeWidthValue) strokeWidthValue.innerText = currentVal + " px";
            
            updateStrokePaletteByTextColor(false);

            applyStyles();
        });
    });

    document.querySelectorAll('#strokeColorRow .color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
            if (sw.classList.contains('custom')) {
                if (window.openPageModal) {
                    window.openPageModal('gotodownload.html');
                }
                return;
            }
            document.querySelectorAll('#strokeColorRow .color-swatch').forEach(s => s.classList.remove('active'));
            sw.classList.add('active');
            if (activeStrokeTab === 'box') {
                boxStrokeColor = sw.dataset.color || "transparent";
            } else if (activeStrokeTab === 'path') {
                pathStrokeColor = sw.dataset.color || "transparent";
            } else {
                signStrokeColor = sw.dataset.color || "transparent";
            }
            applyStyles();
        });
    });

    if (strokeWidthSlider) {
        strokeWidthSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (strokeWidthValue) strokeWidthValue.innerText = val.toFixed(1) + " px";
            if (activeStrokeTab === 'box') {
                boxStrokeWidth = val;
            } else if (activeStrokeTab === 'path') {
                pathStrokeWidth = val;
            } else {
                signStrokeWidth = val;
            }
            applyStyles();
        });
    }

    if (circularSpacingSlider) {
        circularSpacingSlider.addEventListener('input', (e) => {
            circularSpacing = parseInt(e.target.value);
            if (circularSpacingValue) circularSpacingValue.innerText = circularSpacing;
            applyStyles();
        });
    }

    if (angleSlider) {
        angleSlider.addEventListener('input', (e) => {
            circularStartAngle = parseInt(e.target.value);
            if (angleValue) angleValue.innerText = circularStartAngle;
            applyStyles();
        });
    }

    if (cwBtn && ccwBtn) {
        cwBtn.addEventListener('click', () => {
            circularIsClockwise = true;
            cwBtn.classList.add('active');
            ccwBtn.classList.remove('active');
            applyStyles();
        });
        ccwBtn.addEventListener('click', () => {
            circularIsClockwise = false;
            ccwBtn.classList.add('active');
            cwBtn.classList.remove('active');
            applyStyles();
        });
    }
    // Other Sliders
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            currentFontSize = parseFloat(e.target.value);
            if (fontSizeValue) fontSizeValue.innerText = currentFontSize.toFixed(0);
            applyStyles();
        });
    }

    if (lineHeightSlider) {
        lineHeightSlider.addEventListener('input', (e) => {
            currentLineHeight = parseFloat(e.target.value);
            if (lineHeightValue) lineHeightValue.innerText = currentLineHeight.toFixed(1);
            applyStyles();
        });
    }

    if (letterSpacingSlider) {
        letterSpacingSlider.addEventListener('input', (e) => {
            currentLetterSpacing = parseFloat(e.target.value);
            if (letterSpacingValue) letterSpacingValue.innerText = currentLetterSpacing.toFixed(1);
            applyStyles();
        });
    }

    if (radiusSlider) {
        radiusSlider.addEventListener('input', (e) => {
            circularRadius = parseInt(e.target.value);
            if (radiusValue) radiusValue.innerText = circularRadius;
            applyStyles();
        });
    }

    if (displayText) {
    }

    initHeaderStyles();
    updateStrokePaletteByTextColor(false);
    applyStyles();
});

