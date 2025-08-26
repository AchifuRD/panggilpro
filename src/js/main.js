// Main JavaScript functionality
import Alpine from 'alpinejs'

// Initialize Alpine.js
window.Alpine = Alpine
Alpine.start()

// Global app state
window.PanggilPro = {
  currentLang: 'ms',
  user: null,
  location: 'Kuala Lumpur',
  
  // Language system
  translations: {
    en: {
      title: "PanggilPro - Call Pro, Come Direct!",
      selectService: "Select Service",
      chooseCategory: "Choose category to find suitable pro",
      houseCleaning: "House Cleaning",
      cleaningDesc: "Clean house, office, or condo",
      plumber: "Plumber",
      plumberDesc: "Leaky pipes, clogged drains, etc",
      next: "Next",
      availablePros: "Available Professionals",
      chooseOne: "Choose one to continue booking",
      bookingConfirm: "Confirm Your Booking",
      connected60min: "You will be connected with a professional within 60 minutes",
      dateTime: "Date & Time",
      serviceAddress: "Service Address",
      bookingSummary: "Booking Summary",
      service: "Service",
      professional: "Professional",
      totalPrice: "Total Price",
      confirmBooking: "Confirm Booking",
      bookingSuccess: "Booking Successful!",
      serviceConfirmed: "Your service has been confirmed. Here are the booking details.",
      bookingReceipt: "Booking Receipt",
      confirmed: "Confirmed",
      printReceipt: "Print Receipt",
      share: "Share",
      myBookings: "My Bookings",
      viewUpcoming: "View upcoming and past appointments",
      upcoming: "Upcoming",
      myProfile: "My Profile",
      manageAccount: "Manage your account information",
      profilePhoto: "Profile Photo",
      uploadPhoto: "Upload Photo",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      email: "Email",
      saveChanges: "Save Changes",
      contactUs: "Contact Us",
      readyToHelp: "We're ready to help. Contact us for support or feedback.",
      sendMessage: "Send Message to Us",
      contactInfo: "Contact Information",
      phone: "Phone",
      address: "Office Address",
      businessHours: "Business Hours",
      backToHome: "Back to Home"
    },
    ms: {
      title: "PanggilPro - Panggil Pro, Datang Terus!",
      selectService: "Pilih Servis",
      chooseCategory: "Pilih kategori untuk cari pro yang sesuai",
      houseCleaning: "Perapi Rumah",
      cleaningDesc: "Bersihkan rumah, pejabat, atau kondo",
      plumber: "Tukang Paip",
      plumberDesc: "Paip bocor, longkang tersumbat, dll",
      next: "Seterusnya",
      availablePros: "Profesional yang Tersedia",
      chooseOne: "Pilih satu untuk teruskan tempahan",
      bookingConfirm: "Sahkan Tempahan Anda",
      connected60min: "Anda akan dihubungkan dengan profesional dalam 60 minit",
      dateTime: "Tarikh & Masa",
      serviceAddress: "Alamat Servis",
      bookingSummary: "Ringkasan Tempahan",
      service: "Servis",
      professional: "Profesional",
      totalPrice: "Harga Total",
      confirmBooking: "Sahkan Tempahan",
      bookingSuccess: "Tempahan Berjaya!",
      serviceConfirmed: "Servis anda telah disahkan. Ini adalah butiran tempahan.",
      bookingReceipt: "Resit Tempahan",
      confirmed: "Disahkan",
      printReceipt: "Cetak Resit",
      share: "Kongsi",
      myBookings: "Tempahan Saya",
      viewUpcoming: "Lihat temujanji akan datang dan lepas",
      upcoming: "Akan Datang",
      myProfile: "Profil Saya",
      manageAccount: "Urus maklumat akaun anda",
      profilePhoto: "Foto Profil",
      uploadPhoto: "Muat Naik Foto",
      fullName: "Nama Penuh",
      phoneNumber: "Nombor Telefon",
      email: "Emel",
      saveChanges: "Simpan Perubahan",
      contactUs: "Hubungi Kami",
      readyToHelp: "Kami sedia membantu. Hubungi kami untuk sokongan atau maklum balas.",
      sendMessage: "Hantar Mesej Kepada Kami",
      contactInfo: "Maklumat Hubungan",
      phone: "Telefon",
      address: "Alamat Pejabat",
      businessHours: "Waktu Perniagaan",
      backToHome: "Kembali ke Laman Utama"
    }
  },

  // Get translation
  t(key) {
    return this.translations[this.currentLang][key] || key;
  },

  // Toggle language
  toggleLanguage() {
    this.currentLang = this.currentLang === 'ms' ? 'en' : 'ms';
    localStorage.setItem('panggilpro-lang', this.currentLang);
    this.updatePageLanguage();
  },

  // Update page language
  updatePageLanguage() {
    document.querySelectorAll('[data-translate]').forEach(el => {
      const key = el.getAttribute('data-translate');
      el.textContent = this.t(key);
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
      const key = el.getAttribute('data-translate-placeholder');
      el.placeholder = this.t(key);
    });
  },

  // Initialize app
  init() {
    const savedLang = localStorage.getItem('panggilpro-lang');
    if (savedLang) {
      this.currentLang = savedLang;
    }
    this.updatePageLanguage();
  },

  // Service categories
  services: [
    {
      id: 'cleaning',
      icon: 'fas fa-broom',
      color: 'green',
      price: 'RM50-80/session'
    },
    {
      id: 'plumber',
      icon: 'fas fa-wrench',
      color: 'blue',
      price: 'RM40-60/hour'
    },
    {
      id: 'electrician',
      icon: 'fas fa-bolt',
      color: 'yellow',
      price: 'RM45-70/hour'
    },
    {
      id: 'aircon',
      icon: 'fas fa-snowflake',
      color: 'cyan',
      price: 'RM80-120/service'
    },
    {
      id: 'tuition',
      icon: 'fas fa-user-graduate',
      color: 'purple',
      price: 'RM30-50/hour'
    },
    {
      id: 'massage',
      icon: 'fas fa-spa',
      color: 'pink',
      price: 'RM60-100/session'
    }
  ],

  // Sample professionals
  professionals: [
    {
      id: 1,
      name: 'Ali Rahman',
      service: 'Tukang Paip',
      rating: 4.9,
      reviews: 142,
      distance: '5 min',
      price: 'RM40',
      available: true,
      photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 2,
      name: 'Siti Aminah',
      service: 'Perapi Rumah',
      rating: 4.8,
      reviews: 98,
      distance: '8 min',
      price: 'RM55',
      available: true,
      photo: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 3,
      name: 'Kumar Raj',
      service: 'Elektrik',
      rating: 4.7,
      reviews: 76,
      distance: '12 min',
      price: 'RM50',
      available: false,
      photo: 'https://randomuser.me/api/portraits/men/65.jpg'
    }
  ]
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.PanggilPro.init();
});