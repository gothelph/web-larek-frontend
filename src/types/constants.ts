export interface Settings {
  modalElement: string;
  modalSettings: {
    close: string;
    content: string;
    activeClass: string;
  };

  pageSettings: {
    basketCounter: string;
    basketButton: string,
    wrapper: string,
    gallery: string,
    lockClass: string,
  },

  cardSettings: {
    catalogTemplate: string;
    previewTemplate: string;
    basketTemplate: string;
    selectors: {
      category: string;
      title: string;
      image: string;
      price: string;
      description: string;
      button: string;
      alignClass: string;
    };
  };

  basketTemplate: string;
  basketSettings: {
    container: string;
    totalPrice: string;
    checkoutButton: string;
  };

  contactsTemplate: string;
  orderTemplate: string;
  orderSettings: {
    payment: {
      online: string;
      cash: string;
      classActive: string;
    };
  };


  successTemplate: string;
  successSettings: {
    description: string;
    closeButton: string;
  };

  formSettings: {
    errorContainer: string,
    submitButton: string,
  },
}
