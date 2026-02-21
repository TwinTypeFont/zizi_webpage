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
    let currentColor = "#000000";
    let circularRadius = 100.0;
    let circularSpacing = 15.0;
    let circularStartAngle = 0.0;
    let circularIsClockwise = true;
    let activeStrokeTab = 'box';
    let boxStrokeColor = "transparent";
    let boxStrokeWidth = 2.5;
    let pathStrokeColor = "transparent";
    let pathStrokeWidth = 2.5;

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


    function initHeaderStyles() {
        if (currentFontName) {
            currentFontName.style.fontFamily = currentFont;
        }
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
        displayText.style.writingMode = 'horizontal-tb';
        displayText.style.writingMode = 'horizontal-tb';
        displayText.style.webkitWritingMode = 'horizontal-tb';
        displayText.style.textOrientation = 'mixed';
        displayText.style.lineHeight = currentLineHeight;
        displayText.style.letterSpacing = currentLetterSpacing + "px";
        displayText.style.padding = "2px 8px";
        displayText.style.borderRadius = "8px";
        displayText.style.textAlign = "center";
        displayText.style.height = 'auto';
        displayText.style.width = 'auto';
        displayText.style.border = "none";
        displayText.style.color = currentColor;
        displayText.style.fontSize = currentFontSize + "px";
        displayText.style.fontFamily = currentFont;
        displayText.style.fontWeight = "normal";

        if (textArea) {
            const needsDarkBackground = currentColor === "#ffdd9d" || currentColor === "#ffffff";
            if (needsDarkBackground) {
                textArea.classList.add('dark-editor');
            } else {
                textArea.classList.remove('dark-editor');
            }
        }
        if (boxStrokeColor === 'transparent') {
            displayText.style.backgroundColor = "transparent";
            displayText.style.border = "none";
        } else {
            displayText.style.backgroundColor = boxStrokeColor;
            displayText.style.border = `${boxStrokeWidth}px solid ${boxStrokeColor}`;
        }

        if (pathStrokeColor === 'transparent') {
            displayText.style.webkitTextStroke = "0px transparent";
        } else {
            displayText.style.paintOrder = "stroke fill";
            displayText.style.strokeLinejoin = "round";
            displayText.style.webkitTextStroke = `${pathStrokeWidth}px ${pathStrokeColor}`;
        }
        if (standardSizeControls) standardSizeControls.style.display = typeState === 5 ? 'none' : 'block';
        if (circularControls) circularControls.style.display = typeState === 5 ? 'block' : 'none';
        if (lineHeightLabel) lineHeightLabel.innerText = typeState === 4 ? '行距' : '行高';
        const boxTab = document.querySelector('#strokePanel [data-tab="box"]');
        const pathTab = document.querySelector('#strokePanel [data-tab="path"]');
        if (boxTab) {
            boxTab.style.display = typeState === 5 ? 'none' : 'block';
            if (typeState === 5 && activeStrokeTab === 'box') {
                if (pathTab) pathTab.click();
            }
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
                    displayText.style.height = '350px';
                    displayText.style.display = 'flex';
                    displayText.style.flexDirection = 'column';
                    displayText.style.alignItems = 'center';
                    displayText.style.boxDecorationBreak = 'slice';
                    displayText.style.webkitBoxDecorationBreak = 'slice';
                    break;
            }
            if (typeState !== 4) {
                displayText.style.boxDecorationBreak = 'clone';
                displayText.style.webkitBoxDecorationBreak = 'clone';
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
            applyStyles();
        });
    });

    document.querySelectorAll('#strokePanel .tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#strokePanel .tab-item').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeStrokeTab = tab.dataset.tab;
            
            const currentVal = activeStrokeTab === 'box' ? boxStrokeWidth : pathStrokeWidth;
            if (strokeWidthSlider) strokeWidthSlider.value = currentVal;
            if (strokeWidthValue) strokeWidthValue.innerText = currentVal + " px";
            
            const targetColor = activeStrokeTab === 'box' ? boxStrokeColor : pathStrokeColor;
            document.querySelectorAll('#strokeColorRow .color-swatch').forEach(s => {
                s.classList.remove('active');
                if (s.dataset.color === targetColor) s.classList.add('active');
            });
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
            } else {
                pathStrokeColor = sw.dataset.color || "transparent";
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
            } else {
                pathStrokeWidth = val;
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
    applyStyles();
});

