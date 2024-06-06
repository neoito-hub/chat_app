async function addContact(prisma) {
  const bulkData = [{
    id: '1',
    name: 'Adithyan',
    country_code: '91',
    phone_number: '8943227183',
    channel_id: "TEST_ID"
  }, {
    id: '2',
    name: 'joseph',
    country_code: '91',
    phone_number: '897657688dd',
    channel_id: "TEST_ID"
  }];
  await prisma.contacts.createMany({
    data: bulkData
  });
  console.log('Data seeded successfully');
}
export default addContact;
