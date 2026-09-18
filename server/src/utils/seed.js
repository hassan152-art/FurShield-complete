import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Pet } from "../models/Pet.js";
import { AdoptionListing } from "../models/AdoptionListing.js";
import { Product } from "../models/Product.js";
import { CareArticle } from "../models/CareArticle.js";
import { FAQ } from "../models/FAQ.js";
import { Notification } from "../models/Notification.js";
import { Banner } from "../models/Banner.js";

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "FurShield123!";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@furshield.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || DEMO_PASSWORD;

async function seed() {
  await connectDB();

  console.log("Clearing existing demo collections...");

  await Promise.all([
    User.deleteMany({}),
    Pet.deleteMany({}),
    AdoptionListing.deleteMany({}),
    Product.deleteMany({}),
    CareArticle.deleteMany({}),
    FAQ.deleteMany({}),
    Notification.deleteMany({}),
    Banner.deleteMany({}),
  ]);

  console.log("Seeding users...");

  const admin = await User.create({
    role: "admin",
    name: "FurShield Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  const owner = await User.create({
    role: "owner",
    name: "Sara Ahmed",
    email: "owner@furshield.com",
    password: DEMO_PASSWORD,
    contactNumber: "03001234567",
    address: "Karachi, Pakistan",
  });

  const vet = await User.create({
    role: "veterinarian",
    name: "Dr. Bilal Khan",
    email: "vet@furshield.com",
    password: DEMO_PASSWORD,
    specialization: "general",
    experienceYears: 6,
    address: "Karachi, Pakistan",
  });

  const shelter = await User.create({
    role: "shelter",
    name: "Karachi Paws Shelter",
    shelterName: "Karachi Paws Shelter",
    contactPerson: "Ayesha Malik",
    email: "shelter@furshield.com",
    password: DEMO_PASSWORD,
    address: "Karachi, Pakistan",
  });

  console.log("Seeding pets...");

  const pet1 = await Pet.create({
    owner: owner._id,
    name: "Max",
    species: "Dog",
    breed: "Labrador",
    age: 3,
    gender: "male",
  });

  await Pet.create({
    owner: owner._id,
    name: "Luna",
    species: "Cat",
    breed: "Persian",
    age: 2,
    gender: "female",
  });

  console.log("Seeding adoption listings...");

  await AdoptionListing.create({
    shelter: shelter._id,
    name: "Rocky",
    species: "Dog",
    breed: "Mixed",
    age: 2,
    gender: "male",
    location: "Karachi",
    healthStatus: "Healthy",
    personality: "Friendly and energetic",
  });

  await AdoptionListing.create({
    shelter: shelter._id,
    name: "Mimi",
    species: "Cat",
    breed: "Siamese",
    age: 1,
    gender: "female",
    location: "Karachi",
    healthStatus: "Vaccinated",
    personality: "Calm and affectionate",
  });

  console.log("Seeding products...");

  await Product.insertMany([
    {
      name: "Premium Dog Food 5kg",
      category: "food",
      price: 3200,
      stock: 40,
      description: "Balanced nutrition for adult dogs.",
    },
    {
      name: "Cat Grooming Brush",
      category: "grooming",
      price: 850,
      stock: 60,
      description: "Gentle deshedding brush for cats.",
    },
    {
      name: "Interactive Puzzle Toy",
      category: "toys",
      price: 1500,
      stock: 25,
      description: "Keeps pets mentally stimulated.",
    },
    {
      name: "Joint Health Supplement",
      category: "health_supplies",
      price: 2200,
      stock: 30,
      description: "Supports joint mobility in senior pets.",
    },
  ]);

  console.log("Seeding care articles...");

  await CareArticle.insertMany([
    {
      title: "Feeding Your Puppy: A Complete Guide",
      slug: "feeding-your-puppy",
      category: "feeding",
      author: "FurShield Team",
      readingTimeMinutes: 6,
      content:
        "Puppies grow fastest in their first year and need frequent, nutrient-dense meals to support that growth.\n\n" +
        "Up to 4 months old, feed 3-4 small meals a day of a quality puppy-formula food. From 4 to 12 months, " +
        "you can move to two meals a day as growth slows. Always keep fresh water available, and avoid sudden " +
        "food changes — introduce any new diet gradually over 5-7 days to prevent stomach upset.\n\n" +
        "Watch body condition rather than just the bag's feeding chart: you should be able to feel (but not " +
        "see) your puppy's ribs. If you're ever unsure how much to feed, a quick appointment with your vet " +
        "will get you a plan tailored to your puppy's breed and growth curve.",
    },
    {
      title: "Bathing 101: How Often Should You Bathe Your Dog",
      slug: "bathing-101-dogs",
      category: "hygiene",
      author: "Dr. Amina Raza",
      readingTimeMinutes: 4,
      content:
        "Most dogs do well with a bath every 4-6 weeks, though this varies by coat type, activity level and " +
        "skin condition. Over-bathing can strip natural oils and lead to dry, itchy skin.\n\n" +
        "Use a dog-specific shampoo — human shampoo has the wrong pH for a dog's skin. Rinse thoroughly, since " +
        "leftover soap residue is a common cause of irritation. Dry your dog fully, especially in skin folds " +
        "and ears, to avoid trapped moisture that can lead to infections.\n\n" +
        "If your dog is scratching excessively or has a strong odor between baths, that's worth a vet visit " +
        "rather than just an extra bath — it can signal an underlying skin or ear issue.",
    },
    {
      title: "How Much Exercise Does Your Dog Really Need",
      slug: "how-much-exercise-dogs-need",
      category: "exercise",
      author: "FurShield Team",
      readingTimeMinutes: 5,
      content:
        "Exercise needs vary hugely by breed, age and health. As a general guide, most adult dogs benefit from " +
        "30-60 minutes of activity a day, split across one or two walks plus some play or mental stimulation.\n\n" +
        "High-energy working breeds (Border Collies, Huskies, many terriers) often need significantly more, " +
        "while brachycephalic breeds (Pugs, Bulldogs) need shorter, gentler sessions especially in hot weather " +
        "due to breathing difficulty.\n\n" +
        "Puppies should not be over-exercised while their joints are still developing — a common rule of thumb " +
        "is about 5 minutes of structured exercise per month of age, twice a day, until they're fully grown.",
    },
    {
      title: "Grooming Your Cat: A Beginner's Guide",
      slug: "grooming-your-cat",
      category: "grooming",
      author: "Dr. Bilal Khan",
      readingTimeMinutes: 5,
      content:
        "Most cats groom themselves well, but regular brushing still helps reduce shedding and hairballs, and " +
        "gives you a chance to spot lumps, fleas or skin issues early.\n\n" +
        "Short-haired cats do well with weekly brushing; long-haired breeds often need daily attention to " +
        "prevent mats, especially behind the ears, under the arms and around the tail base.\n\n" +
        "Introduce grooming gradually with short, positive sessions and treats, rather than one long session " +
        "that could make your cat anxious about being brushed in future. Nail trims every 2-3 weeks and " +
        "occasional ear checks round out a simple home grooming routine.",
    },
    {
      title: "Puppy and Kitten Vaccination Schedule Explained",
      slug: "vaccination-schedule-explained",
      category: "vaccination",
      author: "Dr. Amina Raza",
      readingTimeMinutes: 7,
      content:
        "Core vaccinations typically start around 6-8 weeks of age and continue as a series of boosters every " +
        "3-4 weeks until about 16 weeks old, when a puppy or kitten's immune system is mature enough to respond " +
        "fully.\n\n" +
        "For dogs, core vaccines usually cover distemper, parvovirus, adenovirus and rabies. For cats, core " +
        "vaccines usually cover panleukopenia, calicivirus, herpesvirus and rabies. Your vet may recommend " +
        "additional non-core vaccines based on lifestyle and local disease risk.\n\n" +
        "After the initial series, most pets need booster shots annually or every three years depending on the " +
        "vaccine type. Use FurShield's health records to keep track of due dates so nothing gets missed.",
    },
    {
      title: "Crate Training: A Step-by-Step Approach",
      slug: "crate-training-step-by-step",
      category: "training",
      author: "FurShield Team",
      readingTimeMinutes: 6,
      content:
        "Crate training gives your dog a safe den-like space and makes travel, vet visits and recovery periods " +
        "much less stressful. Done well, most dogs come to see their crate as a comfortable retreat, not a " +
        "punishment.\n\n" +
        "Start with the door open and toss treats inside so your dog enters voluntarily. Gradually increase the " +
        "time spent inside with the door closed, always pairing it with something positive like a chew toy. " +
        "Avoid using the crate as punishment, and never leave a dog crated for excessively long periods.\n\n" +
        "Most dogs take 1-3 weeks of short, consistent sessions to become comfortable. If your dog shows signs " +
        "of severe distress (panting, drooling, escape attempts), slow down and consult a trainer or your vet.",
    },
    {
      title: "Signs of a Healthy Pet: What to Watch For",
      slug: "signs-of-a-healthy-pet",
      category: "general_health",
      author: "Dr. Bilal Khan",
      readingTimeMinutes: 5,
      content:
        "A healthy pet typically has a shiny coat, clear eyes, pink gums, a good appetite, normal energy levels " +
        "and consistent bathroom habits. Getting familiar with your pet's normal baseline makes it much easier " +
        "to notice when something changes.\n\n" +
        "Weigh your pet periodically — unexplained weight loss or gain is often one of the earliest signs of an " +
        "underlying issue. Check gums for a healthy pink color (pale or bluish gums need urgent attention), and " +
        "keep an eye on water intake, since sudden increases can point to kidney or endocrine problems.\n\n" +
        "Annual wellness checkups, even when your pet seems fine, let your vet catch issues early through " +
        "bloodwork and physical exams that aren't visible day to day.",
    },
    {
      title: "Pet Emergencies: When to Go to the Vet Immediately",
      slug: "pet-emergencies-when-to-go",
      category: "emergency_care",
      author: "Dr. Amina Raza",
      readingTimeMinutes: 6,
      content:
        "Some symptoms warrant an immediate emergency vet visit rather than a wait-and-see approach: difficulty " +
        "breathing, prolonged seizures, suspected poisoning, a bloated or distended abdomen, inability to " +
        "urinate, severe bleeding, or trauma from a fall or car accident.\n\n" +
        "If you suspect poisoning, try to identify what was ingested and roughly how much, and call your vet or " +
        "an emergency animal poison hotline immediately rather than inducing vomiting yourself, since this can " +
        "make some poisonings worse.\n\n" +
        "Keep your regular vet's after-hours number and the nearest 24-hour emergency clinic saved somewhere " +
        "accessible. In a true emergency, minutes matter — this article is general guidance, not a substitute " +
        "for immediate professional care.",
    },
  ]);

  console.log("Seeding FAQs...");

  await FAQ.insertMany([
    {
      question: "How do I book a veterinary appointment on FurShield?",
      answer:
        "Go to Find a Vet, choose a veterinarian, then use the booking form on your dashboard to pick a pet, date and time. You'll see the appointment status update as the vet confirms it.",
      category: "appointments",
    },
    {
      question: "Is payment handled through FurShield?",
      answer:
        "No. FurShield does not process payments. Product orders are recorded as requests only, and payment and delivery are arranged outside the platform.",
      category: "orders",
    },
    {
      question: "How often should my pet see a vet?",
      answer:
        "Most healthy adult pets benefit from an annual wellness checkup, while puppies, kittens and senior pets often need more frequent visits. Your vet can recommend a schedule specific to your pet.",
      category: "general_health",
    },
    {
      question: "Can I adopt a pet directly through FurShield?",
      answer:
        "You can browse adoption listings and submit an interest form. The shelter reviews your submission and contacts you directly to continue the adoption process.",
      category: "adoption",
    },
  ]);

  console.log("Seeding banners...");

  await Banner.insertMany([
    {
      title: "Download our App!",
      subtitle: "Handy features and exclusive deals, right from your pocket.",
      imageUrl:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "/register",
      linkLabel: "Get Started",
      type: "hero",
      backgroundColor: "#BFE8D5",
      order: 1,
    },
    {
      title: "New Vet Partners in Karachi",
      subtitle: "Book with 5 newly onboarded veterinarians this month.",
      imageUrl:
        "https://images.unsplash.com/photo-1587764379873-97837921fd44?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "/vets",
      linkLabel: "Find a Vet",
      type: "hero",
      backgroundColor: "#F5C96A",
      order: 2,
    },
    {
      title: "Adopt, Don't Shop",
      subtitle: "12 pets are waiting for a home near you.",
      imageUrl:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/adoption",
      linkLabel: "Meet them",
      type: "promo",
      backgroundColor: "#BFE8D5",
      order: 1,
    },
    {
      title: "Essentials Restocked",
      subtitle: "Food, grooming and health supplies back in stock.",
      imageUrl:
        "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/products",
      linkLabel: "Shop Now",
      type: "promo",
      backgroundColor: "#F4EBDD",
      order: 2,
    },
    {
      title: "Free First Health Record",
      subtitle: "Add your pet's first vaccination record free this week.",
      imageUrl:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80",
      linkUrl: "/register",
      linkLabel: "Sign Up",
      type: "promo",
      backgroundColor: "#FFE8DC",
      order: 3,
    },
  ]);

  console.log("Seeding notifications...");

  await Notification.create({
    user: owner._id,
    type: "vaccination_due",
    message: "Max is due for a vaccination booster next week.",
  });

  console.log("\nSeed complete.");
  console.log("  Admin:        " + ADMIN_EMAIL + " / " + ADMIN_PASSWORD);
  console.log("  Pet Owner:    owner@furshield.com / " + DEMO_PASSWORD);
  console.log("  Veterinarian: vet@furshield.com / " + DEMO_PASSWORD);
  console.log("  Shelter:      shelter@furshield.com / " + DEMO_PASSWORD);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

