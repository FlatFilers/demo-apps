export async function productValidations(record, products) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    throw new Error('Invalid record input. Expecting a valid record object.');
  }

  // Run API check for existing products
  try {
    console.log('Checking API for existing products...');
    await checkApiForExistingProducts(record, products);
    console.log('API check completed successfully.');
  } catch (error) {
    console.log('Error occurred during API check:', error);
  }

  return record;
}
function checkApiForExistingProducts(record: any, products: any) {
  try {
    // Get the current value of the product_id field
    let productId = record.get('product_id');
    console.log('product_id:', productId); // Log the current value of product_id

    // Check if the product_id matches an id from the API data
    const matchingProduct = products.find((product) => {
      return String(product.externalProductId) === String(productId); // Convert both to strings for comparison
    });

    // If a match is found, add an error to the product_id field
    if (matchingProduct) {
      console.log('Match found, adding error to product_id field');
      record.addError(
        'product_id',
        'Product ID matches an existing ID in PLM application.'
      );
    }
  } catch (error) {
    console.log('Error occurred during API check:', error); // Log any errors that occurred during the check
    // If an error occurred during the check, add an error to the product_id field
    record.addError('product_id', "Couldn't process data from the API.");
  }
  return record;
}
