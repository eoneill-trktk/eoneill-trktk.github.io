(function() {
    function initFilter() {
        // Remove old button elements if they exist
        const oldButtons = document.querySelector('.content-type-buttons');
        if (oldButtons) oldButtons.remove();
        
        // Get or create the dropdown container
        const contentTypeSelector = document.querySelector('.content-type-selector');
        if (!contentTypeSelector) {
            console.log('Content type selector not found, retrying...');
            setTimeout(initFilter, 100);
            return;
        }
        
        // Clear existing dropdowns
        contentTypeSelector.innerHTML = '';
        
        const gridItems = document.querySelectorAll('.gb-grid-column.gb-query-loop-item');
        
        // Service options (alphabetically sorted)
        const serviceOptions = [
            { value: '', label: 'All Services' },
            { value: 'clinical-pharmacy-services', label: 'Clinical Pharmacy Services' },
            { value: 'disability-determination-services', label: 'Disability Determination Services' },
            { value: 'employment-equity-and-workforce-development', label: 'Employment Equity and Workforce Development' },
            { value: 'healthcare-operations-and-regulatory-compliance', label: 'Healthcare Operations and Regulatory Compliance' },
            { value: 'justice-and-health-equity', label: 'Justice and Health Equity' },
            { value: 'long-term-services-and-supports', label: 'Long-Term Services and Supports' },
            { value: 'medicaid-waiver-evaluation', label: 'Medicaid Waiver Evaluation' },
            { value: 'newborn-screening-services', label: 'Newborn Screening Services' },
            { value: 'school-based-services', label: 'School-Based Services' },
            { value: 'state-supplement-program', label: 'State Supplement Program' },
            { value: 'survey-research', label: 'Survey Research' },
            { value: 'third-party-liability-and-benefit-coordination', label: 'Third Party Liability and Benefit Coordination' }
        ];
        
        // Publication type options with display labels
        const typeOptions = [
            { value: 'journal-article', label: 'Journal Article' },
            { value: 'peer-reviewed-journal-article', label: 'Peer Reviewed Journal Article' },
            { value: 'webcast', label: 'Webcast' },
            { value: 'poster', label: 'Poster' },
            { value: 'webinar', label: 'Webinar' },
            { value: 'presentation', label: 'Presentation' },
            { value: 'issue-brief', label: 'Issue Brief' },
            { value: 'perspective', label: 'Perspective' },
            { value: 'white-paper', label: 'White Paper' },
            { value: 'technical-report', label: 'Technical Report' },
            { value: 'multimedia', label: 'Multimedia' },
            { value: 'video', label: 'Video' },
            { value: 'case-study', label: 'Case Study' }
        ];

        // Create new dropdown structure
        const dropdownsHTML = `
            <div class="filter-container" style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <div class="filter-group" style="flex: 1; min-width: 250px;">
                    <label for="services-dropdown" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333872;">Service Area</label>
                    <select id="services-dropdown" class="facetwp-dropdown" style="width: 100%;">
                        ${serviceOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-group" style="flex: 1; min-width: 250px;">
                    <label for="types-dropdown" style="display: block; margin-bottom: 5px; font-weight: 600; color: #333872;">Publication Type</label>
                    <select id="types-dropdown" class="facetwp-dropdown" style="width: 100%;">
                        <option value="">All Types</option>
                    </select>
                </div>
            </div>
        `;
        
        contentTypeSelector.innerHTML = dropdownsHTML;
        
        const style = document.createElement('style');
        style.textContent = `
            .content-type-selector {
                margin-bottom: 20px;
            }
            .facetwp-dropdown {
                padding: 12px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 16px;
                background-color: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .facetwp-dropdown:hover {
                border-color: #333872;
            }
            .facetwp-dropdown:focus {
                outline: none;
                border-color: #0071ce;
                box-shadow: 0 0 0 3px rgba(0, 113, 206, 0.1);
            }
            .gb-grid-column.hidden {
                display: none !important;
            }
            .gb-headline-eyebrow {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 10px;
            }
            .gb-headline.gb-headline-text.gb-headline-news-grid-title a {
                font-size: 20px !important;
                line-height: 1.4;
                color: #333872;
                text-decoration: none;
            }
            .gb-headline.gb-headline-text.gb-headline-news-grid-title a:hover {
                color: #0071ce;
                text-decoration: underline;
            }
            .post-term-item {
                font-size: 14px !important;
                border-radius: 20px !important;
                display: inline-block !important;
                margin-right: 4px;
                margin-bottom: 4px;
                font-weight: 600;
                line-height: 1.2;
                padding: 6px 14px !important;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            /* Publication Type Pill Colors - Accessible and diverse */
            .pill-journal-article { background-color: #1E3A5F !important; color: #FFFFFF !important; }
            .pill-peer-reviewed-journal-article { background-color: #2C3E50 !important; color: #FFFFFF !important; }
            .pill-webcast { background-color: #6C3483 !important; color: #FFFFFF !important; }
            .pill-poster { background-color: #117A65 !important; color: #FFFFFF !important; }
            .pill-webinar { background-color: #B03A2E !important; color: #FFFFFF !important; }
            .pill-presentation { background-color: #D68910 !important; color: #000000 !important; }
            .pill-issue-brief { background-color: #1F618D !important; color: #FFFFFF !important; }
            .pill-perspective { background-color: #8E44AD !important; color: #FFFFFF !important; }
            .pill-white-paper { background-color: #A04000 !important; color: #FFFFFF !important; }
            .pill-technical-report { background-color: #0B5345 !important; color: #FFFFFF !important; }
            .pill-multimedia { background-color: #943126 !important; color: #FFFFFF !important; }
            .pill-video { background-color: #2874A6 !important; color: #FFFFFF !important; }
            .pill-case-study { background-color: #7D6608 !important; color: #FFFFFF !important; }
            .pill-default { background-color: #5D6D7E !important; color: #FFFFFF !important; }
            
            /* Service Pill Colors - Softer but accessible */
            .service-pill {
                background-color: #E8EAF6 !important;
                color: #1A237E !important;
                border: 1px solid #3F51B5 !important;
                font-weight: 500 !important;
            }
            
            /* Filter container responsive */
            @media (max-width: 768px) {
                .filter-container {
                    flex-direction: column;
                    gap: 15px !important;
                }
                .filter-group {
                    min-width: 100% !important;
                }
            }
            
            /* Empty state */
            .no-results-message {
                text-align: center;
                padding: 40px;
                background: #f5f5f5;
                margin: 0 auto;
                border-radius: 8px;
                color: #666;
                font-size: 18px;
                
            }
            .site-footer{
            margin-top: 2em!important
            }
        `;
        document.head.appendChild(style);

        const servicesSelect = document.getElementById('services-dropdown');
        const typesSelect = document.getElementById('types-dropdown');
        
        let currentService = '';
        let currentType = '';

        function getAvailableTypesForService(serviceValue) {
            const availableTypes = new Set();
            
            // FIXED: Don't check for hidden class - check all items
            gridItems.forEach(item => {
                const itemService = item.getAttribute('data-service') || '';
                const itemType = item.getAttribute('data-type') || '';
                
                // If serviceValue is empty (All Services) or matches the item's service
                if (serviceValue === '' || itemService === serviceValue) {
                    if (itemType) {
                        availableTypes.add(itemType);
                    }
                }
            });
            
            return Array.from(availableTypes);
        }

        function updateTypesDropdown(serviceValue) {
            const availableTypes = getAvailableTypesForService(serviceValue);
            
            // Clear all options except "All Types"
            typesSelect.innerHTML = '<option value="">All Types</option>';
            
            // Add available types in the same order as typeOptions
            typeOptions.forEach(opt => {
                if (availableTypes.includes(opt.value)) {
                    const option = document.createElement('option');
                    option.value = opt.value;
                    option.textContent = opt.label;
                    typesSelect.appendChild(option);
                }
            });
            
            // Reset type selection when service changes
            typesSelect.value = '';
            currentType = '';
        }

        function applyFilters() {
            let visibleCount = 0;
            
            gridItems.forEach(item => {
                const itemService = item.getAttribute('data-service') || 'clinical-pharmacy-services'; // Fallback
                const itemType = item.getAttribute('data-type') || 'perspective'; // Fallback
                
                const serviceMatch = currentService === '' || itemService === currentService;
                const typeMatch = currentType === '' || itemType === currentType;
                
                if (serviceMatch && typeMatch) {
                    item.classList.remove('hidden');
                    visibleCount++;
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Show "no results" message if needed
            let noResultsMsg = document.querySelector('.no-results-message');
            if (visibleCount === 0) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.textContent = 'No publications found.';
                    const gridWrapper = document.querySelector('.gb-grid-wrapper');
                    if (gridWrapper) {
                        gridWrapper.appendChild(noResultsMsg);
                    }
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }

        servicesSelect.addEventListener('change', function() {
            currentService = this.value;
            updateTypesDropdown(currentService);
            applyFilters();
        });

        typesSelect.addEventListener('change', function() {
            currentType = this.value;
            applyFilters();
        });

        // Initialize with all services selected
        updateTypesDropdown('');
        applyFilters();
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFilter);
    } else {
        initFilter();
    }
})();