export interface Dataset {
  id: number;
  name: string;
  description: string;
  updated: string;
  size: string;
  format: string;
  price: number;
  domain: string[];
  language: string[];
  license: string;
  quality: string;
  version: string;
  actualData?: any[];
}

export const defaultDatasets: Dataset[] = [
  {
    id: 1,
    name: 'IMDB Movie Reviews',
    description: 'Large movie review dataset for binary sentiment classification',
    updated: 'Jan 15, 2024',
    size: 'Medium',
    format: 'CSV',
    price: 0,
    domain: ['Sentiment Analysis', 'NLP'],
    language: ['English'],
    license: 'MIT',
    quality: 'High',
    version: '1.0',
    actualData: [
      { id: 1, review: "This movie is absolutely fantastic! The acting, storyline, and cinematography are all top-notch. I would definitely recommend it to anyone looking for a great film experience.", sentiment: "positive", rating: 9, length: 181, year: 2019, genre: "Drama" },
      { id: 2, review: "Terrible movie. Poor acting and a confusing plot that makes no sense. I couldn't even finish watching it.", sentiment: "negative", rating: 2, length: 108, year: 2018, genre: "Horror" },
      { id: 3, review: "An okay film with decent performances. Not groundbreaking but entertaining enough for a weekend watch.", sentiment: "positive", rating: 6, length: 112, year: 2020, genre: "Comedy" },
      { id: 4, review: "One of the worst movies I've ever seen. The dialogue is cringe-worthy and the special effects look like they were made in the 90s.", sentiment: "negative", rating: 1, length: 145, year: 2017, genre: "Sci-Fi" },
      { id: 5, review: "Brilliant storytelling with exceptional character development. This film will stay with you long after the credits roll.", sentiment: "positive", rating: 10, length: 142, year: 2021, genre: "Drama" },
      { id: 6, review: "Mediocre at best. The movie has potential but fails to deliver on most fronts. Expected much more from this director.", sentiment: "negative", rating: 4, length: 98, year: 2019, genre: "Action" },
      { id: 7, review: "A masterpiece of modern cinema. Every scene is crafted with precision and the performances are nothing short of spectacular.", sentiment: "positive", rating: 10, length: 156, year: 2022, genre: "Thriller" },
      { id: 8, review: "Boring and predictable. I fell asleep halfway through and didn't miss anything important when I woke up.", sentiment: "negative", rating: 3, length: 89, year: 2018, genre: "Romance" },
      { id: 9, review: "Great movie with excellent pacing and wonderful character arcs. Definitely worth watching multiple times.", sentiment: "positive", rating: 8, length: 134, year: 2020, genre: "Adventure" },
      { id: 10, review: "Disappointing sequel that ruins the legacy of the original. Poor writing and unnecessary plot complications.", sentiment: "negative", rating: 2, length: 162, year: 2021, genre: "Action" },
      { id: 11, review: "Surprisingly good! Went in with low expectations but was pleasantly surprised by the quality of the storytelling.", sentiment: "positive", rating: 7, length: 119, year: 2019, genre: "Comedy" },
      { id: 12, review: "Awful cinematography and even worse sound design. This movie is a technical disaster from start to finish.", sentiment: "negative", rating: 1, length: 201, year: 2017, genre: "Horror" },
      { id: 13, review: "Solid performances from the entire cast. The script is well-written and the direction is spot-on.", sentiment: "positive", rating: 8, length: 127, year: 2022, genre: "Drama" },
      { id: 14, review: "Completely overrated. I don't understand all the hype around this film. It's just another generic blockbuster.", sentiment: "negative", rating: 4, length: 178, year: 2020, genre: "Sci-Fi" },
      { id: 15, review: "Beautiful film with stunning visuals and a heartwarming story. Perfect for family movie night.", sentiment: "positive", rating: 9, length: 105, year: 2021, genre: "Family" },
      { id: 16, review: "Confusing narrative structure that adds nothing to the story. Feels pretentious and unnecessarily complex.", sentiment: "negative", rating: 3, length: 143, year: 2018, genre: "Thriller" },
      { id: 17, review: "Amazing special effects and incredible action sequences. This is how you make a proper summer blockbuster.", sentiment: "positive", rating: 8, length: 167, year: 2022, genre: "Action" },
      { id: 18, review: "Weak character development and a plot full of holes. Even the talented cast couldn't save this mess.", sentiment: "negative", rating: 2, length: 134, year: 2019, genre: "Mystery" },
      { id: 19, review: "Thought-provoking and emotionally resonant. This film tackles important themes with grace and intelligence.", sentiment: "positive", rating: 9, length: 152, year: 2021, genre: "Drama" },
      { id: 20, review: "Painfully slow pacing and pretentious dialogue. I kept checking my watch throughout the entire movie.", sentiment: "negative", rating: 2, length: 189, year: 2020, genre: "Art House" },
      { id: 21, review: "Excellent ensemble cast with great chemistry. The humor is well-timed and the emotional moments hit perfectly.", sentiment: "positive", rating: 8, length: 98, year: 2022, genre: "Comedy" },
      { id: 22, review: "Derivative and uninspired. Feels like I've seen this exact same movie a dozen times before.", sentiment: "negative", rating: 3, length: 156, year: 2018, genre: "Romance" },
      { id: 23, review: "Visually stunning with an incredible soundtrack. Even if the story is simple, the execution is flawless.", sentiment: "positive", rating: 7, length: 145, year: 2021, genre: "Musical" },
      { id: 24, review: "Completely nonsensical plot that seems to have been written by committee. No coherent vision whatsoever.", sentiment: "negative", rating: 1, length: 213, year: 2019, genre: "Fantasy" },
      { id: 25, review: "Masterful direction and cinematography create an immersive experience that showcases the power of film as an art form.", sentiment: "positive", rating: 10, length: 178, year: 2022, genre: "Drama" }
    ]
  },
  {
    id: 2,
    name: 'Iris Flower Dataset',
    description: 'Classic dataset for classification of iris flower species based on sepal and petal measurements',
    updated: 'Dec 10, 2023',
    size: 'Small',
    format: 'CSV',
    price: 0,
    domain: ['Machine Learning', 'Classification'],
    language: ['English'],
    license: 'Public Domain',
    quality: 'Very High',
    version: '1.0',
    actualData: [
      { id: 1, sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 2, sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 3, sepal_length: 4.7, sepal_width: 3.2, petal_length: 1.3, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 4, sepal_length: 4.6, sepal_width: 3.1, petal_length: 1.5, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 5, sepal_length: 5.0, sepal_width: 3.6, petal_length: 1.4, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 6, sepal_length: 7.0, sepal_width: 3.2, petal_length: 4.7, petal_width: 1.4, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 7, sepal_length: 6.4, sepal_width: 3.2, petal_length: 4.5, petal_width: 1.5, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 8, sepal_length: 6.9, sepal_width: 3.1, petal_length: 4.9, petal_width: 1.5, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 9, sepal_length: 5.5, sepal_width: 2.3, petal_length: 4.0, petal_width: 1.3, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 10, sepal_length: 6.5, sepal_width: 2.8, petal_length: 4.6, petal_width: 1.5, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 11, sepal_length: 6.3, sepal_width: 3.3, petal_length: 6.0, petal_width: 2.5, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 12, sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 13, sepal_length: 7.1, sepal_width: 3.0, petal_length: 5.9, petal_width: 2.1, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 14, sepal_length: 6.3, sepal_width: 2.9, petal_length: 5.6, petal_width: 1.8, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 15, sepal_length: 6.5, sepal_width: 3.0, petal_length: 5.8, petal_width: 2.2, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 16, sepal_length: 4.8, sepal_width: 3.4, petal_length: 1.6, petal_width: 0.2, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 17, sepal_length: 4.8, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.1, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 18, sepal_length: 4.3, sepal_width: 3.0, petal_length: 1.1, petal_width: 0.1, species: "setosa", color: "white", origin: "North America", discovered_year: 1936 },
      { id: 19, sepal_length: 5.7, sepal_width: 2.8, petal_length: 4.5, petal_width: 1.3, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 20, sepal_length: 6.3, sepal_width: 3.3, petal_length: 4.7, petal_width: 1.6, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 21, sepal_length: 4.9, sepal_width: 2.4, petal_length: 3.3, petal_width: 1.0, species: "versicolor", color: "purple", origin: "Eastern North America", discovered_year: 1753 },
      { id: 22, sepal_length: 7.7, sepal_width: 2.6, petal_length: 6.9, petal_width: 2.3, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 23, sepal_length: 6.0, sepal_width: 2.2, petal_length: 5.0, petal_width: 1.5, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 24, sepal_length: 6.9, sepal_width: 3.2, petal_length: 5.7, petal_width: 2.3, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 },
      { id: 25, sepal_length: 5.6, sepal_width: 2.8, petal_length: 4.9, petal_width: 2.0, species: "virginica", color: "blue", origin: "Southeastern United States", discovered_year: 1860 }
    ]
  },
  {
    id: 3,
    name: 'Customer Purchase Dataset',
    description: 'E-commerce customer purchase data with demographics and transaction details',
    updated: 'Feb 20, 2024',
    size: 'Medium',
    format: 'JSONL',
    price: 0,
    domain: ['E-commerce', 'Analytics'],
    language: ['English'],
    license: 'Apache 2.0',
    quality: 'High',
    version: '2.1',
    actualData: [
      { customer_id: "CUST001", name: "Alice Johnson", age: 28, gender: "Female", location: "New York", purchase_amount: 156.78, product_category: "Electronics", purchase_date: "2024-01-15", payment_method: "Credit Card", customer_satisfaction: 4.2, loyalty_tier: "Gold" },
      { customer_id: "CUST002", name: "Bob Smith", age: 34, gender: "Male", location: "Los Angeles", purchase_amount: 89.99, product_category: "Clothing", purchase_date: "2024-01-16", payment_method: "PayPal", customer_satisfaction: 3.8, loyalty_tier: "Silver" },
      { customer_id: "CUST003", name: "Carol Davis", age: 42, gender: "Female", location: "Chicago", purchase_amount: 234.56, product_category: "Home & Garden", purchase_date: "2024-01-17", payment_method: "Debit Card", customer_satisfaction: 4.7, loyalty_tier: "Platinum" },
      { customer_id: "CUST004", name: "David Wilson", age: 25, gender: "Male", location: "Houston", purchase_amount: 67.23, product_category: "Books", purchase_date: "2024-01-18", payment_method: "Credit Card", customer_satisfaction: 4.1, loyalty_tier: "Bronze" },
      { customer_id: "CUST005", name: "Eva Martinez", age: 31, gender: "Female", location: "Phoenix", purchase_amount: 445.67, product_category: "Electronics", purchase_date: "2024-01-19", payment_method: "Apple Pay", customer_satisfaction: 4.9, loyalty_tier: "Platinum" },
      { customer_id: "CUST006", name: "Frank Brown", age: 38, gender: "Male", location: "Philadelphia", purchase_amount: 123.45, product_category: "Sports & Outdoors", purchase_date: "2024-01-20", payment_method: "Credit Card", customer_satisfaction: 3.6, loyalty_tier: "Silver" },
      { customer_id: "CUST007", name: "Grace Lee", age: 29, gender: "Female", location: "San Antonio", purchase_amount: 78.90, product_category: "Beauty", purchase_date: "2024-01-21", payment_method: "Google Pay", customer_satisfaction: 4.4, loyalty_tier: "Gold" },
      { customer_id: "CUST008", name: "Henry Taylor", age: 45, gender: "Male", location: "San Diego", purchase_amount: 345.23, product_category: "Automotive", purchase_date: "2024-01-22", payment_method: "Debit Card", customer_satisfaction: 4.0, loyalty_tier: "Gold" },
      { customer_id: "CUST009", name: "Ivy Chen", age: 26, gender: "Female", location: "Dallas", purchase_amount: 189.76, product_category: "Clothing", purchase_date: "2024-01-23", payment_method: "Credit Card", customer_satisfaction: 4.6, loyalty_tier: "Silver" },
      { customer_id: "CUST010", name: "Jack Robinson", age: 52, gender: "Male", location: "San Jose", purchase_amount: 567.89, product_category: "Electronics", purchase_date: "2024-01-24", payment_method: "PayPal", customer_satisfaction: 4.3, loyalty_tier: "Platinum" },
      { customer_id: "CUST011", name: "Kate Anderson", age: 33, gender: "Female", location: "Austin", purchase_amount: 92.34, product_category: "Health & Personal Care", purchase_date: "2024-01-25", payment_method: "Apple Pay", customer_satisfaction: 3.9, loyalty_tier: "Bronze" },
      { customer_id: "CUST012", name: "Liam O'Connor", age: 41, gender: "Male", location: "Jacksonville", purchase_amount: 278.65, product_category: "Home & Garden", purchase_date: "2024-01-26", payment_method: "Credit Card", customer_satisfaction: 4.5, loyalty_tier: "Gold" },
      { customer_id: "CUST013", name: "Mia Rodriguez", age: 24, gender: "Female", location: "San Francisco", purchase_amount: 156.43, product_category: "Books", purchase_date: "2024-01-27", payment_method: "Google Pay", customer_satisfaction: 4.8, loyalty_tier: "Silver" },
      { customer_id: "CUST014", name: "Noah Thompson", age: 36, gender: "Male", location: "Columbus", purchase_amount: 423.78, product_category: "Sports & Outdoors", purchase_date: "2024-01-28", payment_method: "Debit Card", customer_satisfaction: 4.1, loyalty_tier: "Platinum" },
      { customer_id: "CUST015", name: "Olivia Garcia", age: 27, gender: "Female", location: "Fort Worth", purchase_amount: 87.65, product_category: "Beauty", purchase_date: "2024-01-29", payment_method: "PayPal", customer_satisfaction: 3.7, loyalty_tier: "Bronze" },
      { customer_id: "CUST016", name: "Paul Miller", age: 48, gender: "Male", location: "Charlotte", purchase_amount: 689.90, product_category: "Electronics", purchase_date: "2024-01-30", payment_method: "Credit Card", customer_satisfaction: 4.4, loyalty_tier: "Platinum" },
      { customer_id: "CUST017", name: "Quinn Davis", age: 30, gender: "Non-binary", location: "Seattle", purchase_amount: 145.67, product_category: "Clothing", purchase_date: "2024-02-01", payment_method: "Apple Pay", customer_satisfaction: 4.2, loyalty_tier: "Gold" },
      { customer_id: "CUST018", name: "Rachel White", age: 35, gender: "Female", location: "Denver", purchase_amount: 234.89, product_category: "Automotive", purchase_date: "2024-02-02", payment_method: "Google Pay", customer_satisfaction: 4.0, loyalty_tier: "Silver" },
      { customer_id: "CUST019", name: "Sam Wilson", age: 22, gender: "Male", location: "Washington", purchase_amount: 76.54, product_category: "Health & Personal Care", purchase_date: "2024-02-03", payment_method: "Debit Card", customer_satisfaction: 3.8, loyalty_tier: "Bronze" },
      { customer_id: "CUST020", name: "Tina Lopez", age: 39, gender: "Female", location: "Boston", purchase_amount: 356.78, product_category: "Home & Garden", purchase_date: "2024-02-04", payment_method: "Credit Card", customer_satisfaction: 4.6, loyalty_tier: "Gold" },
      { customer_id: "CUST021", name: "Victor Kim", age: 44, gender: "Male", location: "El Paso", purchase_amount: 198.43, product_category: "Books", purchase_date: "2024-02-05", payment_method: "PayPal", customer_satisfaction: 4.3, loyalty_tier: "Silver" },
      { customer_id: "CUST022", name: "Wendy Johnson", age: 32, gender: "Female", location: "Nashville", purchase_amount: 467.89, product_category: "Sports & Outdoors", purchase_date: "2024-02-06", payment_method: "Apple Pay", customer_satisfaction: 4.7, loyalty_tier: "Platinum" },
      { customer_id: "CUST023", name: "Xavier Brown", age: 28, gender: "Male", location: "Detroit", purchase_amount: 123.76, product_category: "Beauty", purchase_date: "2024-02-07", payment_method: "Google Pay", customer_satisfaction: 3.9, loyalty_tier: "Bronze" },
      { customer_id: "CUST024", name: "Yolanda Martinez", age: 37, gender: "Female", location: "Oklahoma City", purchase_amount: 289.45, product_category: "Electronics", purchase_date: "2024-02-08", payment_method: "Debit Card", customer_satisfaction: 4.1, loyalty_tier: "Gold" },
      { customer_id: "CUST025", name: "Zachary Taylor", age: 43, gender: "Male", location: "Portland", purchase_amount: 534.67, product_category: "Automotive", purchase_date: "2024-02-09", payment_method: "Credit Card", customer_satisfaction: 4.5, loyalty_tier: "Platinum" }
    ]
  }
];

export const getDatasets = (): Dataset[] => {
  if (typeof window === 'undefined') return defaultDatasets;
  
  const stored = localStorage.getItem('datasets');
  if (stored) {
    return JSON.parse(stored);
  }
  
  localStorage.setItem('datasets', JSON.stringify(defaultDatasets));
  return defaultDatasets;
};
