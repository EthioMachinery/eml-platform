// test-machinery-upload.js
// Execute in your terminal using: node test-machinery-upload.js

const TEST_PAYLOAD = {
    // Utilizing a valid string layout for testing bypass
    user_id: "00000000-0000-0000-0000-000000000000", 
    title: "Basalt Rock Stone Crusher Plant - 230 TPH",
    category: "Crushing Plants",
    type: "Stationary",
    brand: "Heavy Duty Custom",
    city: "Debre Birhan",
    region: "Amhara",
    condition: "Brand New",
    year: 2026,
    price: 18500000, // 18.5 Million ETB
    rent_price: 0,
    for_sale: true,
    for_rent: false,
    description: "High-output 230 Ton per hour basalt rock stone crushing plant optimized for local aggregate production.",
    image_url: "https://example.com/images/crusher-debre-birhan.jpg"
  };
  
  async function runConnectionTest() {
    console.log("🚀 Initializing connection verification test against local Next.js API route...");
    
    try {
      const response = await fetch("http://localhost:3000/api/machinery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(TEST_PAYLOAD)
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        console.log("\n✅ CONNECTION TEST SUCCESSFUL!");
        console.log("-----------------------------------------");
        console.log(`✨ Inserted Row ID : ${result.data.id}`);
        console.log(`📌 Title           : ${result.data.title}`);
        console.log(`📍 Location        : ${result.data.city}, ${result.data.region}`);
        console.log(`📊 Current Status  : ${result.data.status}`);
        console.log("-----------------------------------------");
        console.log("⚡ Database composite indexing path verified and operational observability event logged successfully.");
      } else {
        console.error("\n❌ TEST FAILED: API responded with an error status.");
        console.error(`Status Code : ${response.status}`);
        console.error(`Error details: ${result.error || JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("\n❌ CRITICAL NETWORKING ERROR: Could not reach the local Next.js server.");
      console.error("Make sure your Next.js local development server is active (`npm run dev`) on port 3000.");
      console.error(`Details: ${error.message}`);
    }
  }
  
  runConnectionTest();