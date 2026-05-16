(function () {
  'use strict';

  const DEFAULT_CONFIG = {
    position: 'bottom-right',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    accentColor: '#3b82f6',
    borderRadius: 16,
    companyName: 'Empresa',
    logo: null,
    description: '',
    socialLinks: [
      { name: 'WhatsApp', url: 'https://wa.me/', icon: 'whatsapp' },
      { name: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
      { name: 'Facebook', url: 'https://facebook.com/', icon: 'facebook' },
      { name: 'TikTok', url: 'https://tiktok.com/', icon: 'tiktok' }
    ],
    secondaryLinks: [
      { name: 'Sitio web', url: '#', icon: 'globe' },
      { name: 'Correo', url: 'mailto:', icon: 'mail' }
    ]
  };

  class SocialWidget {
    constructor() {
      this.config = { ...DEFAULT_CONFIG };
      this.isOpen = false;
      this.isSecondaryOpen = false;
      this.shadowRoot = null;
      this.tenantId = null;
      this.init();
    }

    init() {
      const scriptTag = document.currentScript;
      this.tenantId = scriptTag?.getAttribute('data-tenant') || this.getTenantFromURL();

      if (!this.tenantId) {
        console.warn('[SocialWidget] No tenant ID provided');
        return;
      }

      this.createShadowContainer();
      this.fetchConfig();
    }

    getTenantFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get('tenant');
    }

    createShadowContainer() {
      const container = document.createElement('div');
      container.id = 'social-widget-container';
      container.style.cssText = `
        position: fixed;
        z-index: 999999;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      const position = this.config.position.split('-');
      container.style[position[0]] = '20px';
      container.style[position[1]] = '20px';

      document.body.appendChild(container);

      this.shadowRoot = container.attachShadow({ mode: 'open' });
      this.render();
    }

async fetchConfig() {
      try {
        // Fetch tenant config
        const tenantResponse = await fetch(
          `https://nrlheaawsxdwditkgckc.supabase.co/rest/v1/tenants?slug=eq.${this.tenantId}&select=*`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE'
            },
            cache: 'no-store'
          }
        );

        if (!tenantResponse.ok) throw new Error('Failed to fetch tenant');

        const tenants = await tenantResponse.json();
        
        if (!tenants || tenants.length === 0) {
          console.warn('[SocialWidget] Tenant not found:', this.tenantId);
          return;
        }

        const tenant = tenants[0];
        
        // Fetch social_links
        const socialResponse = await fetch(
          `https://nrlheaawsxdwditkgckc.supabase.co/rest/v1/social_links?tenant_id=eq.${tenant.id}&select=*&order=sort_order`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE'
            },
            cache: 'no-store'
          }
        );

        // Fetch secondary_links
        const secondaryResponse = await fetch(
          `https://nrlheaawsxdwditkgckc.supabase.co/rest/v1/secondary_links?tenant_id=eq.${tenant.id}&select=*&order=sort_order`,
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybGhlYWF3c3hkd2RpdGtnY2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDAyNDMsImV4cCI6MjA5NDQ3NjI0M30.OUJY3thQxD5YOmyAAzF7qeriX6GHAzVllYe7Hyn_4DE'
            },
            cache: 'no-store'
          }
        );

        const socialLinks = socialResponse.ok ? await socialResponse.json() : [];
        const secondaryLinks = secondaryResponse.ok ? await secondaryResponse.json() : [];

        // Mapear datos al formato del widget
        this.config = {
          ...this.config,
          companyName: tenant.company_name,
          logo: tenant.logo,
          description: tenant.description,
          primaryColor: tenant.primary_color,
          secondaryColor: tenant.secondary_color,
          accentColor: tenant.accent_color,
          borderRadius: tenant.border_radius,
          position: tenant.position,
          socialLinks: socialLinks.map(link => ({
            name: link.label,
            url: link.url,
            icon: link.platform
          })),
          secondaryLinks: secondaryLinks.map(link => ({
            name: link.label,
            url: link.url,
            icon: link.icon
          }))
        };

        this.updateStyles();
        
        // Re-render with new data
        this.render();
        
        console.log('[SocialWidget] Config loaded:', this.config);
      } catch (error) {
        console.error('[SocialWidget] Error:', error.message);
      }
    }

    updateStyles() {
      const container = this.shadowRoot.querySelector('.widget-container');
      if (container) {
        container.style.setProperty('--primary-color', this.config.primaryColor);
        container.style.setProperty('--secondary-color', this.config.secondaryColor);
        container.style.setProperty('--accent-color', this.config.accentColor);
        container.style.setProperty('--border-radius', `${this.config.borderRadius}px`);
      }
    }

    render() {
      const styles = this.getStyles();
      const html = this.getHTML();

      this.shadowRoot.innerHTML = `
        <style>${styles}</style>
        ${html}
      `;

      this.attachEventListeners();
    }

    getStyles() {
      return `
        :host {
          --primary-color: ${this.config.primaryColor};
          --secondary-color: ${this.config.secondaryColor};
          --accent-color: ${this.config.accentColor};
          --border-radius: ${this.config.borderRadius}px;
          --transition-speed: 250ms;
          --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.12);
          --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.16);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .widget-container {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .sticky-button {
          width: 60px;
          height: 60px;
          border-radius: var(--border-radius);
          border: none;
          background: var(--primary-color);
          color: var(--secondary-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-soft);
          transition: transform var(--transition-speed) ease-out,
                      box-shadow var(--transition-speed) ease-out;
          position: relative;
        }

        .sticky-button:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-hover);
        }

        .sticky-button:active {
          transform: scale(0.95);
        }

        .sticky-button svg {
          width: 28px;
          height: 28px;
          transition: transform var(--transition-speed) ease-out;
        }

        .sticky-button:hover svg {
          transform: rotate(5deg);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--transition-speed) ease-out,
                      visibility var(--transition-speed) ease-out;
          z-index: 999999;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: var(--secondary-color);
          border-radius: var(--border-radius);
          padding: 28px;
          max-width: 380px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          transform: scale(0.9) translateY(20px);
          transition: transform var(--transition-speed) ease-out;
          box-shadow: var(--shadow-soft);
        }

        .modal-overlay.active .modal {
          transform: scale(1) translateY(0);
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-logo {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          object-fit: cover;
          background: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .modal-logo img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .close-button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-speed) ease-out;
          color: var(--primary-color);
          opacity: 0.6;
        }

        .close-button:hover {
          background: rgba(0, 0, 0, 0.05);
          opacity: 1;
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--primary-color);
          background: rgba(0, 0, 0, 0.03);
          transition: transform var(--transition-speed) ease-out,
                      background var(--transition-speed) ease-out;
          font-weight: 500;
          font-size: 14px;
        }

        .social-link:hover {
          transform: translateY(-2px);
          background: rgba(0, 0, 0, 0.06);
        }

        .social-link svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .secondary-section {
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          padding-top: 16px;
        }

        .secondary-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--primary-color);
          font-size: 14px;
          transition: background var(--transition-speed) ease-out;
        }

        .secondary-link:hover {
          background: rgba(0, 0, 0, 0.03);
        }

        .secondary-link svg {
          width: 18px;
          height: 18px;
          opacity: 0.7;
        }

        .expand-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: transparent;
          color: var(--primary-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background var(--transition-speed) ease-out,
                      border-color var(--transition-speed) ease-out;
          margin-top: 12px;
        }

        .expand-button:hover {
          background: rgba(0, 0, 0, 0.03);
          border-color: rgba(0, 0, 0, 0.2);
        }

        .expand-button svg {
          width: 16px;
          height: 16px;
          transition: transform var(--transition-speed) ease-out;
        }

        .expand-button:hover svg {
          transform: translateX(4px);
        }

        .description {
          font-size: 14px;
          color: var(--primary-color);
          opacity: 0.7;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        @media (max-width: 480px) {
          .modal {
            padding: 20px;
            max-width: calc(100% - 32px);
          }

          .social-grid {
            grid-template-columns: 1fr;
          }
        }
      `;
    }

    getHTML() {
      const icons = this.getIcons();

      return `
        <div class="widget-container">
          <button class="sticky-button" aria-label="Abrir widget">
            ${icons.message}
          </button>

          <div class="modal-overlay" id="mainModal">
            <div class="modal" onclick="event.stopPropagation()">
              <div class="modal-header">
                <div class="modal-title">
                  <div class="modal-logo">
                    ${this.config.logo ? `<img src="${this.config.logo}" alt="${this.config.companyName}" />` : this.config.companyName.charAt(0)}
                  </div>
                  <span>${this.config.companyName}</span>
                </div>
                <button class="close-button" id="closeMainModal">
                  ${icons.close}
                </button>
              </div>

              ${this.config.description ? `<p class="description">${this.config.description}</p>` : ''}

              <div class="social-grid" id="socialGrid">
                ${this.renderSocialLinks(icons)}
              </div>

              <button class="expand-button" id="openSecondaryModal">
                ${icons.info}
                <span>Ver más información</span>
                ${icons.arrow}
              </button>
            </div>
          </div>

          <div class="modal-overlay" id="secondaryModal">
            <div class="modal" onclick="event.stopPropagation()">
              <div class="modal-header">
                <div class="modal-title">
                  <span>Información adicional</span>
                </div>
                <button class="close-button" id="closeSecondaryModal">
                  ${icons.close}
                </button>
              </div>

              <div class="secondary-section" id="secondaryLinks">
                ${this.renderSecondaryLinks(icons)}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    renderSocialLinks(icons) {
      const links = this.config.socialLinks || [
        { name: 'WhatsApp', url: 'https://wa.me/', icon: 'whatsapp' },
        { name: 'Instagram', url: 'https://instagram.com/', icon: 'instagram' },
        { name: 'Facebook', url: 'https://facebook.com/', icon: 'facebook' },
        { name: 'TikTok', url: 'https://tiktok.com/', icon: 'tiktok' }
      ];

      return links.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link">
          ${icons[link.icon] || icons.link}
          <span>${link.name}</span>
        </a>
      `).join('');
    }

    renderSecondaryLinks(icons) {
      const links = this.config.secondaryLinks || [
        { name: 'Visitar sitio web', url: '#', icon: 'globe' },
        { name: 'Enviar correo', url: 'mailto:', icon: 'mail' }
      ];

      return links.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="secondary-link">
          ${icons[link.icon] || icons.link}
          <span>${link.name}</span>
        </a>
      `).join('');
    }

    getIcons() {
      return {
        message: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>`,
        close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>`,
        info: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`,
        arrow: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>`,
        link: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>`,
        whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.162-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>`,
        instagram: `<svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>`,
        facebook: `<svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>`,
        tiktok: `<svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>`,
        globe: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>`,
        mail: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>`
      };
    }

    attachEventListeners() {
      const stickyButton = this.shadowRoot.querySelector('.sticky-button');
      const mainModal = this.shadowRoot.querySelector('#mainModal');
      const closeMainModal = this.shadowRoot.querySelector('#closeMainModal');
      const openSecondaryModal = this.shadowRoot.querySelector('#openSecondaryModal');
      const secondaryModal = this.shadowRoot.querySelector('#secondaryModal');
      const closeSecondaryModal = this.shadowRoot.querySelector('#closeSecondaryModal');

      stickyButton?.addEventListener('click', () => this.openMainModal());
      closeMainModal?.addEventListener('click', () => this.closeMainModal());
      mainModal?.addEventListener('click', (e) => {
        if (e.target === mainModal) this.closeMainModal();
      });

      openSecondaryModal?.addEventListener('click', () => this.openSecondaryModal());
      closeSecondaryModal?.addEventListener('click', () => this.closeSecondaryModal());
      secondaryModal?.addEventListener('click', (e) => {
        if (e.target === secondaryModal) this.closeSecondaryModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.isSecondaryOpen) this.closeSecondaryModal();
          else if (this.isOpen) this.closeMainModal();
        }
      });
    }

    openMainModal() {
      const modal = this.shadowRoot.querySelector('#mainModal');
      modal?.classList.add('active');
      this.isOpen = true;
    }

    closeMainModal() {
      const modal = this.shadowRoot.querySelector('#mainModal');
      modal?.classList.remove('active');
      this.isOpen = false;
    }

    openSecondaryModal() {
      const modal = this.shadowRoot.querySelector('#secondaryModal');
      modal?.classList.add('active');
      this.isSecondaryOpen = true;
      this.closeMainModal();
    }

    closeSecondaryModal() {
      const modal = this.shadowRoot.querySelector('#secondaryModal');
      modal?.classList.remove('active');
      this.isSecondaryOpen = false;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SocialWidget());
  } else {
    new SocialWidget();
  }
})();