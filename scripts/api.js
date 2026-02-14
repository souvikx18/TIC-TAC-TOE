// Premium Notification System
const NotificationSystem = {
    // Icons for Different Types
    icons: {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        confirm: '❓'
    },

    // Inject Containers if they don't exist
    init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        if (!document.getElementById('modal-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'modal-overlay';
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="custom-modal">
                    <span class="modal-icon" id="modal-icon"></span>
                    <h3 class="modal-title" id="modal-title"></h3>
                    <p class="modal-text" id="modal-text"></p>
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="modal-cancel">Cancel</button>
                        <button class="modal-btn modal-btn-confirm" id="modal-confirm">Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    },

    // Show a Toast Message
    toast(message, type = 'info', duration = 4000) {
        this.init();
        const container = document.getElementById('toast-container');

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icon = this.icons[type] || this.icons.info;

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <div class="toast-content">
                <p class="toast-message">${message}</p>
            </div>
            <div class="toast-progress">
                <div class="toast-progress-bar" style="animation: progressAnim ${duration}ms linear forwards"></div>
            </div>
        `;

        container.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 500);
        }, duration);
    },

    // Show a Custom Modal (Confirmation)
    confirm(title, text, onConfirm, onCancel = null) {
        this.init();
        const overlay = document.getElementById('modal-overlay');
        const iconEl = document.getElementById('modal-icon');
        const titleEl = document.getElementById('modal-title');
        const textEl = document.getElementById('modal-text');
        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');

        iconEl.textContent = this.icons.confirm;
        titleEl.textContent = title;
        textEl.textContent = text;

        overlay.classList.add('show');

        // Reset handlers
        const cleanup = () => {
            overlay.classList.remove('show');
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
        };

        confirmBtn.onclick = () => {
            cleanup();
            if (onConfirm) onConfirm();
        };

        cancelBtn.onclick = () => {
            cleanup();
            if (onCancel) onCancel();
        };
    },

    // Premium Welcome Experience
    welcome(username, onComplete) {
        // Create full screen overlay if it doesn't exist
        let overlay = document.getElementById('welcome-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'welcome-overlay';
            overlay.className = 'welcome-overlay';
            overlay.innerHTML = `
                <div class="welcome-particles" id="welcome-particles"></div>
                <div class="welcome-content">
                    <span class="welcome-badge">👑</span>
                    <h1 class="welcome-title">Welcome Back!</h1>
                    <p class="welcome-subtitle" id="welcome-user"></p>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        document.getElementById('welcome-user').textContent = username;

        // Generate Particles for premium feel
        const particleContainer = document.getElementById('welcome-particles');
        if (particleContainer) {
            particleContainer.innerHTML = '';
            const particleCount = 40;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                const size = Math.random() * 4 + 2;
                const left = Math.random() * 100;
                const duration = Math.random() * 2 + 3;
                const delay = Math.random() * 2;

                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${left}%`;
                particle.style.setProperty('--duration', `${duration}s`);
                particle.style.animationDelay = `${delay}s`;

                particleContainer.appendChild(particle);
            }
        }

        // Show overlay
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Redirect after delay
        setTimeout(() => {
            // First trigger the redirect while screen is still full
            if (onComplete) onComplete();

            // Then fade out slowly - though the page will likely change anyway
            overlay.style.opacity = '0';
            overlay.style.transition = 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)';

            setTimeout(() => {
                overlay.classList.remove('show');
                overlay.style.opacity = ''; // Reset for next time
            }, 1000);
        }, 3500); // Show for 3.5 seconds to enjoy the effect
    }
};

// API Configuration and Helper Functions
const SERVER_URL = 'http://localhost:5000';
const API_BASE_URL = `${SERVER_URL}/api`;

// Token management - Kept for backwards compatibility
const TokenManager = {
    // No longer stores token in localStorage (now using secure HTTP-only cookies)
    set: (token) => {
        // Deprecated - token is now set as HTTP-only cookie by server
        console.warn('TokenManager.set is deprecated. Token is now stored in HTTP-only cookies.');
    },
    get: () => {
        // Deprecated - token is now in HTTP-only cookies
        return null;
    },
    remove: () => {
        // Deprecated - token will be cleared by server via logout
        console.warn('TokenManager.remove is deprecated. Use logout API instead.');
    },
    isAuthenticated: async () => {
        // Check authentication by making a request to profile endpoint
        try {
            await API.request('/auth/profile', { method: 'GET' });
            return true;
        } catch (error) {
            return false;
        }
    }
};

// User data management
const UserManager = {
    set: (user) => localStorage.setItem('user', JSON.stringify(user)),
    get: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    remove: () => localStorage.removeItem('user'),
    logout: async () => {
        try {
            // Call logout API to clear the cookie
            await API.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            UserManager.remove();
            window.location.href = 'login.html';
        }
    }
};

// API Client
const API = {
    BASE_URL: API_BASE_URL,
    SERVER_URL: SERVER_URL,
    // Generic request handler
    async request(endpoint, options = {}) {
        const config = {
            credentials: 'include', // Send cookies with every request
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                // Extract detailed error message from server response
                let errorMessage = data.message || 'Request failed';

                // If there are validation errors, show them
                if (data.errors && Array.isArray(data.errors)) {
                    errorMessage = data.errors.map(err => err.message).join(', ');
                }

                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            // If it's a network error, provide a helpful message
            if (error.message === 'Failed to fetch') {
                throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
            }
            throw error;
        }
    },

    // Authentication endpoints
    auth: {
        async signup(username, email, password) {
            return await API.request('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });
        },

        async login(email, password) {
            return await API.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async forgotPassword(email) {
            return await API.request('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
        },

        async verifyResetToken(token) {
            return await API.request(`/auth/verify-reset-token/${token}`, {
                method: 'GET'
            });
        },

        async resetPassword(token, password) {
            return await API.request(`/auth/reset-password/${token}`, {
                method: 'POST',
                body: JSON.stringify({ password })
            });
        },

        async getProfile() {
            return await API.request('/auth/profile', {
                method: 'GET'
            });
        },

        async updateProfile(profileData) {
            return await API.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },

        async uploadProfilePicture(formData) {
            // FormData request - still need credentials for cookies
            const response = await fetch(`${API.BASE_URL}/auth/profile-picture`, {
                method: 'POST',
                credentials: 'include', // Send cookies
                body: formData
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error uploading profile picture');
            }
            return data;
        }
    },

    // Contact endpoint
    contact: {
        async send(name, email, message) {
            return await API.request('/contact', {
                method: 'POST',
                body: JSON.stringify({ name, email, message })
            });
        }
    }
};

// Display error messages
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Display success messages
function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }
}

// Update UI based on authentication status
function updateAuthUI() {
    const user = UserManager.get();
    const isAuthenticated = TokenManager.isAuthenticated();

    // Target the specific auth container
    const authNav = document.getElementById('auth-nav');
    if (!authNav) return;

    if (isAuthenticated && user) {
        // Clear and show user info + logout
        authNav.innerHTML = `
            <a href="profile.html" class="user-display" style="text-decoration: none;">
                <span>${user.username}</span>
            </a>
            <button id="logout-btn" class="btn-logout">Logout</button>
        `;

        // Bind logout event
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                NotificationSystem.confirm(
                    'Logout Confirmation',
                    'Are you sure you want to logout from your account?',
                    () => UserManager.logout()
                );
            });
        }
    } else {
        // Reset to default login/signup if on a page that should show them
        // Note: Some pages like login/signup don't need this as much
        authNav.innerHTML = `
            <a href="login.html" class="btn btn-secondary">Login</a>
            <a href="signup.html" class="btn btn-primary">Sign Up</a>
        `;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);
