// UI module for SAT-DISCOVERY
// Renders list cards, filter chips, and handles item selection

const UI = {
    selectedItem: null,
    
    // Render satellite cards in results panel
    renderCards(satellites, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (satellites.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🛰️</div>
                    <div class="empty-state-text">No satellites found</div>
                </div>
            `;
            return;
        }
        
        satellites.forEach(sat => {
            const card = this.createCard(sat);
            container.appendChild(card);
        });
    },
    
    // Create a single satellite card
    createCard(sat) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = sat.id;
        
        const badges = [];
        badges.push(`<span class="badge badge-${sat.type.toLowerCase()}">${sat.type}</span>`);
        
        if (sat.publicArchive === true) {
            badges.push('<span class="badge badge-archive">Archive</span>');
        }
        if (sat.programming) {
            badges.push('<span class="badge badge-tasking">Tasking</span>');
        }
        if (sat.commercial) {
            badges.push('<span class="badge badge-commercial">Commercial</span>');
        } else {
            badges.push('<span class="badge badge-public">Public</span>');
        }
        
        card.innerHTML = `
            <div class="card-title">${this.escapeHtml(sat.name)}</div>
            <div class="card-subtitle">${this.escapeHtml(sat.operator)}</div>
            <div class="card-content">
                ${sat.coverage ? `Coverage: ${this.escapeHtml(sat.coverage)}` : ''}
                ${sat.revisitDays ? ` • Revisit: ${sat.revisitDays} days` : ''}
            </div>
            <div class="card-footer">
                ${badges.join('')}
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.selectCard(sat);
        });
        
        return card;
    },
    
    // Select a card
    selectCard(sat) {
        this.selectedItem = sat;
        // Navigate to satellite detail page
        window.location.hash = `#satellite/${encodeURIComponent(sat.name)}`;
    },
    
    // Render filter chips
    renderFilterChips(container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        const active = Filters.getActive();
        
        // Search chip
        if (active.search) {
            container.appendChild(
                this.createChip('Search', active.search, () => Filters.clearFilter('search'))
            );
        }
        
        // Type chips
        active.types.forEach(type => {
            container.appendChild(
                this.createChip('Type', type, () => Filters.toggleType(type))
            );
        });
        
        // Archive chip
        if (active.archive !== null) {
            container.appendChild(
                this.createChip('Archive', active.archive ? 'Yes' : 'No', () => Filters.clearFilter('archive'))
            );
        }
        
        // Tasking chip
        if (active.tasking !== null) {
            container.appendChild(
                this.createChip('Tasking', active.tasking ? 'Yes' : 'No', () => Filters.clearFilter('tasking'))
            );
        }
        
        // Commercial chip
        if (active.commercial !== null) {
            container.appendChild(
                this.createChip('Commercial', active.commercial ? 'Yes' : 'No', () => Filters.clearFilter('commercial'))
            );
        }
        
        // Operator chip
        if (active.operator) {
            container.appendChild(
                this.createChip('Operator', active.operator, () => Filters.clearFilter('operator'))
            );
        }
        
        // Clear all button
        if (Filters.getActiveCount() > 0) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'btn btn-small';
            clearBtn.textContent = 'Clear All';
            clearBtn.addEventListener('click', () => Filters.clearAll());
            container.appendChild(clearBtn);
        }
    },
    
    // Create a filter chip
    createChip(label, value, onRemove) {
        const chip = document.createElement('div');
        chip.className = 'chip active';
        chip.innerHTML = `
            <span>${this.escapeHtml(label)}: ${this.escapeHtml(value)}</span>
            <span class="chip-remove">×</span>
        `;
        
        chip.querySelector('.chip-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            onRemove();
        });
        
        return chip;
    },
    
    // Update results count
    updateResultsCount(count, container) {
        if (!container) return;
        container.textContent = `${count} satellite${count !== 1 ? 's' : ''} found`;
    },
    
    // Render source cards
    renderSourceCards(sources, container) {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (sources.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📡</div>
                    <div class="empty-state-text">No sources found</div>
                </div>
            `;
            return;
        }
        
        sources.forEach(source => {
            const card = document.createElement('div');
            card.className = 'card';
            
            card.innerHTML = `
                <div class="card-title">${this.escapeHtml(source.name)}</div>
                <div class="card-content">
                    ${source.desc ? this.escapeHtml(source.desc) : ''}
                </div>
                ${source.url ? `
                    <div style="margin-top: 0.75rem;">
                        <a href="${this.escapeHtml(source.url)}" target="_blank" class="btn btn-small">Visit Site</a>
                    </div>
                ` : ''}
            `;
            
            container.appendChild(card);
        });
    },
    
    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // Show loading state
    showLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading"></div>
                <div style="margin-top: 1rem; color: var(--yellow);">Loading...</div>
            </div>
        `;
    }
};

// Make it available globally
window.UI = UI;
