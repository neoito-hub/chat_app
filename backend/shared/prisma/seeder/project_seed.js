async function addProject(prisma) {
  await prisma.projects.create({
    data: {
      id: "1",
      name: 'Sample project',
      webhook_url: 'YOUR_WEBHOOK_URL',
      channel_name: 'YOUR_CENTRIFUGO_CHANNEL_NAME',
      whatsapp_business_id: 'YOUR_BUSINESS_ID',
      whatsapp_phone_number_id: 'YOUR_PHONE_NUMBER_ID',
      whatsapp_business_token: 'YOUR_BUSINESS_TOKEN',
      webhook_verify_token: 'YOUR_WEHOOK_VERIFY_TOKEN'
    }
  });
  console.log('Data seeded successfully');
}
export default addProject;
