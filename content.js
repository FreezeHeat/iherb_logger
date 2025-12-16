function scrapeAndSend() {
    // Use specific, non-redundant names for clarity.
    const listPrice = document.querySelector('.list-price')?.textContent.trim() || null;
    const listUnitPrice = document.querySelector('.list-price-per-unit')?.textContent.trim() || null;
    const discountPrice = document.querySelector('.discount-price')?.textContent.trim() || null;
    const discountUnitPrice = document.querySelector('.discount-price-per-unit')?.textContent.trim() || null;
    const innerContent = document.querySelector('.inner-content')?.innerHTML || null;

    // Validation: Only save if inner content is present AND at least one price type is found.
    const hasPrice = listPrice || discountPrice;

    if (hasPrice && innerContent) {
    const dataToSend = {
      type: "SAVE_PRODUCT",
      url: window.location.href,
      // Use the null-coalescing operator (||) in the object for clean data
      // If a price is null, it's saved as null, not 'N/A' string.
      price: listPrice,
      unitPrice: listUnitPrice,
      discountPrice: discountPrice,
      discountUnitPrice: discountUnitPrice,
      content: innerContent
    };

    chrome.runtime.sendMessage(dataToSend, (response) => {
      console.log('Logging Status:', response.status);
    });
    }
}

scrapeAndSend();
