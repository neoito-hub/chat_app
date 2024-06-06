async function addVendor(prisma) {
  await prisma.api_vendor.create({
    data: {
      id: 1,
      vendor_type: 'Cloud API',
      vendor_name: 'WhatsApp Cloud API',
      vendor_base_url: 'https://graph.facebook.com/',
      vendor_api_version: 'v15.0',
      status: 'active'
    }
  });
  console.log('Data seeded successfully');
}
export default addVendor;
