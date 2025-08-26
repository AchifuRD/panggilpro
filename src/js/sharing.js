// Sharing functionality
class SharingService {
  constructor() {
    this.baseUrl = window.location.origin;
  }

  // Share booking receipt
  async shareBooking(bookingData) {
    const shareData = {
      title: 'PanggilPro - Tempahan Berjaya',
      text: `Saya telah menempah ${bookingData.service} dengan ${bookingData.professional} melalui PanggilPro!`,
      url: `${this.baseUrl}/receipt.html?booking=${bookingData.id}`
    };

    try {
      if (navigator.share && this.isMobileDevice()) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } else {
        return this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error: error.message };
    }
  }

  // Share professional profile
  async shareProfessional(proData) {
    const shareData = {
      title: `${proData.name} - ${proData.service} | PanggilPro`,
      text: `Jumpa profesional terbaik untuk ${proData.service}. Rating ${proData.rating}⭐`,
      url: `${this.baseUrl}/pro-profile.html?id=${proData.id}`
    };

    try {
      if (navigator.share && this.isMobileDevice()) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } else {
        return this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error: error.message };
    }
  }

  // Share app
  async shareApp() {
    const shareData = {
      title: 'PanggilPro - Panggil Pro, Datang Terus!',
      text: 'Dapatkan perkhidmatan profesional dalam 60 minit! Plumber, cleaner, tutor dan lagi.',
      url: this.baseUrl
    };

    try {
      if (navigator.share && this.isMobileDevice()) {
        await navigator.share(shareData);
        return { success: true, method: 'native' };
      } else {
        return this.showShareModal(shareData);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      return { success: false, error: error.message };
    }
  }

  // Show share modal for desktop
  showShareModal(shareData) {
    return new Promise((resolve) => {
      const modal = this.createShareModal(shareData);
      document.body.appendChild(modal);
      
      // Show modal
      setTimeout(() => modal.classList.add('show'), 10);
      
      // Handle close
      const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(modal);
          resolve({ success: true, method: 'modal' });
        }, 300);
      };

      modal.querySelector('.share-modal-close').onclick = closeModal;
      modal.querySelector('.share-modal-backdrop').onclick = closeModal;
    });
  }

  // Create share modal
  createShareModal(shareData) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-modal-backdrop"></div>
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>Kongsi</h3>
          <button class="share-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="share-modal-body">
          <div class="share-preview">
            <h4>${shareData.title}</h4>
            <p>${shareData.text}</p>
            <small>${shareData.url}</small>
          </div>
          <div class="share-options">
            <button class="share-option" onclick="window.sharingService.shareToWhatsApp('${shareData.text}', '${shareData.url}')">
              <i class="fab fa-whatsapp"></i>
              WhatsApp
            </button>
            <button class="share-option" onclick="window.sharingService.shareToFacebook('${shareData.url}')">
              <i class="fab fa-facebook"></i>
              Facebook
            </button>
            <button class="share-option" onclick="window.sharingService.shareToTwitter('${shareData.text}', '${shareData.url}')">
              <i class="fab fa-twitter"></i>
              Twitter
            </button>
            <button class="share-option" onclick="window.sharingService.shareToTelegram('${shareData.text}', '${shareData.url}')">
              <i class="fab fa-telegram"></i>
              Telegram
            </button>
            <button class="share-option" onclick="window.sharingService.copyToClipboard('${shareData.url}')">
              <i class="fas fa-copy"></i>
              Salin Link
            </button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  // Share to specific platforms
  shareToWhatsApp(text, url) {
    const message = encodeURIComponent(`${text} ${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }

  shareToFacebook(url) {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  shareToTwitter(text, url) {
    const tweet = encodeURIComponent(`${text} ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}`, '_blank');
  }

  shareToTelegram(text, url) {
    const message = encodeURIComponent(`${text} ${url}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }

  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Link disalin ke clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showToast('Link disalin ke clipboard!');
    }
  }

  // Show toast notification
  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  }

  // Check if mobile device
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}

// Initialize sharing service
window.sharingService = new SharingService();
export default window.sharingService;