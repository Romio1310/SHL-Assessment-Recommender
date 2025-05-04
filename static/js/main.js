// SHL Assessment Recommender Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode toggle
    initDarkMode();
    
    // Initialize animations
    initAnimations();
    
    // Initialize interactive form elements
    initFormElements();
    
    // Initialize toast notifications
    initToastNotifications();
    
    // Initialize mobile menu
    initMobileMenu();

    // Initialize the share functionality
    initShareFunctionality();

    // Unified loading overlay handling - priority for recommendations page
    handleLoadingOverlay();

    // Print functionality
    const printButton = document.getElementById('print-button');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }

    // Assessment comparison functionality
    const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
    const compareButton = document.getElementById('compare-button');
    const compareCount = document.getElementById('compare-count');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeComparisonBtn = document.getElementById('close-comparison-btn');
    const closeComparisonX = document.getElementById('close-comparison');
    const comparisonContainer = document.getElementById('comparison-container');
    
    let selectedAssessments = [];
    
    if (compareCheckboxes.length > 0) {
        compareCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const assessmentId = this.dataset.assessmentId;
                const assessmentName = this.dataset.assessmentName;
                
                if (this.checked) {
                    if (selectedAssessments.length < 3) {
                        selectedAssessments.push({
                            id: assessmentId,
                            name: assessmentName
                        });
                    } else {
                        this.checked = false;
                        // Use a safe way to show toast
                        if (typeof window.showToast === 'function') {
                            window.showToast('You can compare up to 3 assessments at once', 'warning');
                        } else {
                            console.warn('You can compare up to 3 assessments at once');
                        }
                        return;
                    }
                } else {
                    selectedAssessments = selectedAssessments.filter(assessment => 
                        assessment.id !== assessmentId
                    );
                }
                
                // Update the compare button and count
                const selectedCount = selectedAssessments.length;
                if (compareCount) {
                    compareCount.textContent = selectedCount;
                }
                
                if (compareButton) {
                    if (selectedCount >= 2) {
                        compareButton.classList.remove('hidden');
                    } else {
                        compareButton.classList.add('hidden');
                    }
                }
            });
        });
    }
    
    if (compareButton && comparisonModal && comparisonContainer) {
        compareButton.addEventListener('click', function() {
            try {
                // Prepare the comparison modal
                comparisonContainer.innerHTML = '';
                
                selectedAssessments.forEach(assessment => {
                    const card = document.querySelector(`.recommendation-card[data-assessment-id="${assessment.id}"]`);
                    if (!card) {
                        console.error(`Card not found for assessment ID: ${assessment.id}`);
                        return;
                    }
                    
                    const cardClone = card.cloneNode(true);
                    
                    // Remove the comparison checkbox from the clone
                    const checkboxWrapper = cardClone.querySelector('.comparison-checkbox-wrapper');
                    if (checkboxWrapper) {
                        checkboxWrapper.remove();
                    }
                    
                    // Add a flex-1 class to make the cards equal width
                    cardClone.classList.add('flex-1', 'min-w-[250px]');
                    cardClone.classList.remove('group', 'hover:-translate-y-1', 'hover:rotate-0.5');
                    
                    // Add to the comparison container
                    comparisonContainer.appendChild(cardClone);
                });
                
                // Show the comparison modal
                comparisonModal.classList.remove('hidden');
                comparisonModal.classList.add('flex');
                document.body.classList.add('overflow-hidden');
            } catch (error) {
                console.error("Error in comparison functionality:", error);
                if (typeof window.showToast === 'function') {
                    window.showToast('An error occurred while comparing assessments', 'error');
                }
            }
        });
    }
    
    // Close comparison modal
    if (closeComparisonBtn) {
        closeComparisonBtn.addEventListener('click', closeComparisonModal);
    }
    
    if (closeComparisonX) {
        closeComparisonX.addEventListener('click', closeComparisonModal);
    }
    
    function closeComparisonModal() {
        if (!comparisonModal) return;
        
        comparisonModal.classList.add('opacity-0');
        setTimeout(function() {
            comparisonModal.classList.add('hidden');
            comparisonModal.classList.remove('flex', 'opacity-0');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    }
});

/**
 * Unified loading overlay handler that works across all pages
 */
function handleLoadingOverlay() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (!loadingOverlay) return;
    
    // If we're on the recommendations page (has results), hide overlay immediately
    if (document.querySelector('.recommendation-card')) {
        hideLoadingOverlay(loadingOverlay, 100);
        return;
    }
    
    // For standard page loads, hide after a delay
    hideLoadingOverlay(loadingOverlay, 800);
    
    // Show loading overlay when submitting forms that lead to recommendations
    const recommendationForms = document.querySelectorAll('form[data-loading="true"]');
    recommendationForms.forEach(form => {
        form.addEventListener('submit', function() {
            if (loadingOverlay) {
                // Show the overlay
                loadingOverlay.style.display = 'flex';
                loadingOverlay.classList.remove('opacity-0');
                
                // Add a safety timeout - hide overlay after 30 seconds if stuck
                setTimeout(() => {
                    if (loadingOverlay.style.display === 'flex') {
                        console.log("Safety timeout triggered for loading overlay");
                        hideLoadingOverlay(loadingOverlay, 0);
                    }
                }, 30000);
            }
        });
    });
}

/**
 * Helper function to hide loading overlay with proper animation
 * @param {HTMLElement} overlay - The loading overlay element
 * @param {number} delay - Delay in ms before starting the hide animation
 */
function hideLoadingOverlay(overlay, delay = 500) {
    if (!overlay) return;
    
    setTimeout(() => {
        overlay.classList.add('opacity-0');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 500);
    }, delay);
}

/**
 * Initialize the Share Modal and functionality
 */
function initShareFunctionality() {
    const shareButton = document.getElementById('share-button');
    const shareModal = document.getElementById('share-modal');
    const closeShareBtn = document.getElementById('close-share');
    const shareLinkInput = document.getElementById('share-link');
    const copyLinkButton = document.getElementById('copy-link');
    const shareEmailButton = document.getElementById('share-email');
    const sharePdfButton = document.getElementById('share-pdf');
    const shareWhatsappButton = document.getElementById('share-whatsapp');
    
    if (!shareButton || !shareModal) return;
    
    // Open share modal
    shareButton.addEventListener('click', function() {
        // Set the current URL for sharing
        if (shareLinkInput) {
            shareLinkInput.value = window.location.href;
        }
        
        // Show the modal
        shareModal.classList.remove('hidden');
        shareModal.classList.add('flex');
        
        // Prevent background scrolling
        document.body.classList.add('overflow-hidden');
        
        // Focus on the link input for easy copying
        if (shareLinkInput) {
            setTimeout(() => {
                shareLinkInput.focus();
                shareLinkInput.select();
            }, 100);
        }
    });
    
    // Close share modal
    if (closeShareBtn) {
        closeShareBtn.addEventListener('click', function() {
            closeShareModal();
        });
    }
    
    // Close on outside click
    shareModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeShareModal();
        }
    });
    
    // Copy link functionality
    if (copyLinkButton && shareLinkInput) {
        copyLinkButton.addEventListener('click', function() {
            shareLinkInput.select();
            document.execCommand('copy');
            
            // Show success animation
            copyLinkButton.classList.add('bg-green-100', 'dark:bg-green-800', 'text-green-700', 'dark:text-green-300');
            copyLinkButton.innerHTML = '<i class="ri-check-line mr-1"></i>Copied!';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyLinkButton.classList.remove('bg-green-100', 'dark:bg-green-800', 'text-green-700', 'dark:text-green-300');
                copyLinkButton.innerHTML = '<i class="ri-file-copy-line mr-1"></i>Copy';
            }, 2000);
            
            // Show toast notification
            showToast('Link copied to clipboard!', 'success');
        });
    }
    
    // Email share functionality
    if (shareEmailButton) {
        shareEmailButton.addEventListener('click', function() {
            const subject = encodeURIComponent('SHL Assessment Recommendations');
            const body = encodeURIComponent(`Check out my SHL Assessment recommendations: ${window.location.href}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    }
    
    // PDF export functionality
    if (sharePdfButton) {
        sharePdfButton.addEventListener('click', function() {
            // Visual feedback that PDF is being prepared
            sharePdfButton.innerHTML = '<i class="ri-loader-4-line animate-spin mr-2"></i>Preparing...';
            
            // Generate PDF from the content
            try {
                // In a real implementation, you would use a library like html2pdf.js
                // For now, simulate PDF generation with a delay
                setTimeout(() => {
                    window.print();
                    
                    // Reset button
                    sharePdfButton.innerHTML = '<i class="ri-file-pdf-line mr-2"></i>PDF';
                    
                    // Show toast
                    showToast('PDF generated successfully! Use your browser\'s print dialog to save as PDF.', 'success');
                }, 1500);
            } catch (error) {
                console.error('PDF generation failed:', error);
                
                // Reset button
                sharePdfButton.innerHTML = '<i class="ri-file-pdf-line mr-2"></i>PDF';
                
                // Show error toast
                showToast('Could not generate PDF. Please try again.', 'error');
            }
        });
    }
    
    // WhatsApp share functionality
    if (shareWhatsappButton) {
        shareWhatsappButton.addEventListener('click', function() {
            const text = encodeURIComponent(`Check out my SHL Assessment recommendations: ${window.location.href}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        });
    }
    
    // Close share modal function
    function closeShareModal() {
        shareModal.classList.remove('flex');
        shareModal.classList.add('opacity-0');
        
        setTimeout(() => {
            shareModal.classList.add('hidden');
            shareModal.classList.remove('opacity-0');
            document.body.classList.remove('overflow-hidden');
        }, 300);
    }
}

/**
 * Dark Mode Implementation
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    
    if (darkModeToggle) {
        // Check for saved user preference
        const savedDarkMode = localStorage.getItem('darkMode');
        
        // Check for system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Apply dark mode if saved or preferred by system
        if (savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode)) {
            htmlElement.classList.add('dark');
        }
        
        // Toggle dark mode on click
        darkModeToggle.addEventListener('click', function() {
            htmlElement.classList.toggle('dark');
            
            // Save preference
            const isDarkMode = htmlElement.classList.contains('dark');
            localStorage.setItem('darkMode', isDarkMode.toString());
            
            // Add animation for dark mode transition
            animateDarkModeTransition(isDarkMode);
        });
    }
}

/**
 * Add smooth transition animation when changing between dark/light mode
 */
function animateDarkModeTransition(isDark) {
    // Create a full-screen overlay for transition effect
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[9999] transition-opacity duration-500 pointer-events-none';
    overlay.style.backgroundColor = isDark ? '#000' : '#fff';
    overlay.style.opacity = '0';
    document.body.appendChild(overlay);
    
    // Animate the overlay
    setTimeout(() => {
        overlay.style.opacity = '0.2';
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        }, 200);
    }, 10);
}

/**
 * Initialize animations for elements
 */
function initAnimations() {
    // Animate on scroll effect
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const animateOnScroll = () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible) {
                element.classList.add('animated');
            }
        });
    };
    
    // Run once on load
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate progress bars in recommendation cards when visible
    initProgressBars();
}

/**
 * Initialize animated progress bars
 */
function initProgressBars() {
    // Function to animate a progress bar
    window.animateProgressBar = function(selector, targetWidth) {
        const progressBar = document.querySelector(selector);
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = targetWidth + '%';
                progressBar.style.transition = 'width 1000ms ease-out';
            }, 50);
        }
    };
    
    // Handle progress bars in accordion details
    document.addEventListener('toggle', function(e) {
        if (e.target.tagName === 'DETAILS' && e.target.open) {
            // Check if this is inside a recommendation card
            const cardIndex = e.target.closest('.group')?.dataset.index;
            if (cardIndex && window.assessmentScores && window.assessmentScores[cardIndex]) {
                const scores = window.assessmentScores[cardIndex];
                
                // Animate job role progress bar if it exists
                if (scores.jobRole !== undefined) {
                    animateProgressBar(`#job-role-progress-${cardIndex}`, scores.jobRole);
                }
                
                // Animate experience progress bar if it exists
                if (scores.experience !== undefined) {
                    setTimeout(() => {
                        animateProgressBar(`#exp-progress-${cardIndex}`, scores.experience);
                    }, 200);
                }
                
                // Animate industry progress bar if it exists
                if (scores.industry !== undefined) {
                    setTimeout(() => {
                        animateProgressBar(`#ind-progress-${cardIndex}`, scores.industry);
                    }, 400);
                }
                
                // Animate all skill progress bars if they exist
                if (scores.skills) {
                    let delay = 600;
                    Object.entries(scores.skills).forEach(([skillIndex, score]) => {
                        setTimeout(() => {
                            animateProgressBar(`#skill-progress-${cardIndex}-${skillIndex}`, score);
                        }, delay);
                        delay += 150;
                    });
                }
            }
        }
    }, true);
}

/**
 * Initialize interactive form elements
 */
function initFormElements() {
    // Enhanced select dropdowns
    const customSelects = document.querySelectorAll('select');
    
    customSelects.forEach(select => {
        // Update visual indicator when value changes
        select.addEventListener('change', function() {
            const selectId = this.id;
            const indicator = document.getElementById(`${selectId}_indicator`);
            
            if (indicator) {
                if (this.value) {
                    indicator.classList.add('bg-primary-500', 'dark:bg-primary-400');
                    this.classList.add('border-primary-300', 'dark:border-primary-600');
                } else {
                    indicator.classList.remove('bg-primary-500', 'dark:bg-primary-400');
                    this.classList.remove('border-primary-300', 'dark:border-primary-600');
                }
            }
            
            // For multi-select, update the preview
            if (this.multiple) {
                updateMultiSelectPreview(this);
            }
        });
        
        // Apply initial state
        const event = new Event('change');
        select.dispatchEvent(event);
    });
    
    // Initialize multi-select previews
    const multiSelects = document.querySelectorAll('select[multiple]');
    multiSelects.forEach(select => {
        updateMultiSelectPreview(select);
        
        // Update on change
        select.addEventListener('change', function() {
            updateMultiSelectPreview(this);
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Remove old error messages
            this.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Check required fields
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                // Reset validation state
                field.classList.remove('border-red-500', 'dark:border-red-500');
                
                // Multi-select validation
                if (field.tagName === 'SELECT' && field.multiple) {
                    if (!field.value || field.selectedOptions.length === 0) {
                        e.preventDefault();
                        isValid = false;
                        validationError(field, 'Please select at least one option');
                    }
                }
                // Regular field validation
                else if (!field.value) {
                    e.preventDefault();
                    isValid = false;
                    validationError(field, 'This field is required');
                }
            });
            
            return isValid;
        });
    });
}

/**
 * Display validation error for a form field
 */
function validationError(field, message) {
    // Add error styling
    field.classList.add('border-red-500', 'dark:border-red-500');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message flex items-center text-red-500 dark:text-red-400 mt-2 opacity-0 transform translate-y-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg';
    errorDiv.innerHTML = `<i class="ri-error-warning-line mr-1.5"></i>${message}`;
    
    // Insert after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    
    // Animate in
    setTimeout(() => {
        errorDiv.style.opacity = '1';
        errorDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Add shake effect for better visual feedback
    field.style.transform = 'translateX(10px)';
    setTimeout(() => {
        field.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            field.style.transform = 'translateX(5px)';
            setTimeout(() => {
                field.style.transform = 'translateX(0)';
            }, 50);
        }, 50);
    }, 50);
    
    // Focus on the field
    field.focus();
    
    // Show toast notification
    if (typeof window.showToast === 'function') {
        window.showToast(message, 'error');
    }
}

/**
 * Update visual preview for multi-select dropdowns
 */
function updateMultiSelectPreview(select) {
    const previewId = `${select.id}-preview`;
    let previewContainer = document.getElementById(previewId);
    
    // Create preview container if it doesn't exist
    if (!previewContainer) {
        previewContainer = document.createElement('div');
        previewContainer.id = previewId;
        previewContainer.className = 'mt-3 flex flex-wrap gap-2 empty:hidden';
        select.parentNode.insertBefore(previewContainer, select.nextSibling);
    }
    
    // Clear existing preview
    previewContainer.innerHTML = '';
    
    // Get selected options
    const selectedOptions = Array.from(select.selectedOptions);
    
    // Create tag for each selected option
    selectedOptions.forEach(option => {
        const tag = document.createElement('span');
        tag.className = 'px-2.5 py-1 rounded-full text-xs bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 animate-fade-in flex items-center';
        tag.innerHTML = `${option.text}`;
        previewContainer.appendChild(tag);
    });
}

/**
 * Initialize toast notification system
 */
function initToastNotifications() {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3';
        document.body.appendChild(toastContainer);
    }
    
    // Function to show toast notifications
    window.showToast = function(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const colors = {
            info: 'bg-blue-500',
            success: 'bg-green-500',
            warning: 'bg-amber-500',
            error: 'bg-red-500'
        };
        const icons = {
            info: 'ri-information-line',
            success: 'ri-checkbox-circle-line',
            warning: 'ri-alert-line',
            error: 'ri-error-warning-line'
        };
        
        toast.className = `${colors[type]} text-white py-3 px-4 rounded-lg shadow-lg flex items-center min-w-[250px] max-w-sm translate-y-10 opacity-0 transition-all duration-300`;
        toast.innerHTML = `
            <i class="${icons[type]} text-lg mr-2.5"></i>
            <span>${message}</span>
            <button class="ml-auto text-white/80 hover:text-white">
                <i class="ri-close-line"></i>
            </button>
        `;
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0)';
            toast.style.opacity = '1';
        });
        
        // Set up close button
        const closeBtn = toast.querySelector('button');
        closeBtn.addEventListener('click', () => {
            removeToast(toast);
        });
        
        // Auto remove after duration
        setTimeout(() => {
            removeToast(toast);
        }, duration);
    };
    
    function removeToast(toast) {
        // Animate out
        toast.style.transform = 'translateY(10px)';
        toast.style.opacity = '0';
        
        // Remove from DOM after animation
        setTimeout(() => {
            toast.remove();
        }, 300);
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            // Toggle menu
            if (mobileMenu.classList.contains('translate-x-full')) {
                // Open menu
                mobileMenu.classList.remove('translate-x-full');
                document.body.classList.add('overflow-hidden');
                
                // Show overlay
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.remove('opacity-0', 'pointer-events-none');
                } else {
                    // Create overlay if it doesn't exist
                    const overlay = document.createElement('div');
                    overlay.id = 'mobile-menu-overlay';
                    overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300';
                    document.body.appendChild(overlay);
                    
                    // Add click event to close menu when clicking outside
                    overlay.addEventListener('click', function() {
                        mobileMenuBtn.click();
                    });
                }
            } else {
                // Close menu
                mobileMenu.classList.add('translate-x-full');
                document.body.classList.remove('overflow-hidden');
                
                // Hide overlay
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.add('opacity-0', 'pointer-events-none');
                }
            }
        });
        
        // Close menu when clicking a nav link
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.click();
            });
        });
    }
}