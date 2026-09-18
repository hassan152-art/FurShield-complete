import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../services/api.js";
import Card from "../../components/ui/Card.jsx";
import Spinner from "../../components/ui/Spinner.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

const categories = [
  { value: "", label: "All" },
  { value: "feeding", label: "Feeding" },
  { value: "hygiene", label: "Hygiene" },
  { value: "exercise", label: "Exercise" },
  { value: "grooming", label: "Grooming" },
  { value: "vaccination", label: "Vaccination" },
  { value: "training", label: "Training" },
  { value: "general_health", label: "General Health" },
  { value: "emergency_care", label: "Emergency Care" },
];

export default function CareGuide() {
  const [articles, setArticles] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("articles");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/care/articles", { params: { category: category || undefined } }),
      api.get("/care/faqs"),
    ])
      .then(([articlesRes, faqsRes]) => {
        setArticles(articlesRes.data.data.articles);
        setFaqs(faqsRes.data.data.faqs);
      })
      .catch(() => toast.error("Unable to load care guide content"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-forest">Care Guide</h1>
      <p className="text-muted mt-2">Practical, vet-informed guidance for feeding, health, grooming and more.</p>

      <div className="mt-8 flex gap-3 border-b border-sand">
        {["articles", "faqs"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t ? "border-emerald text-emerald" : "border-transparent text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "articles" && (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border ${
                  category === c.value ? "bg-emerald text-white border-emerald" : "border-sand text-muted"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {loading ? (
              <Spinner label="Loading articles..." />
            ) : articles.length === 0 ? (
              <EmptyState title="No articles in this category yet" description="Check back soon or browse another category." />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((a) => (
                  <Link key={a._id} to={`/care/${a.slug}`}>
                    <Card className="h-full flex flex-col">
                      <div className="aspect-video bg-mint/40 rounded-xl mb-4 flex items-center justify-center text-forest/40 text-sm">
                        No image
                      </div>
                      <p className="text-xs uppercase text-emerald font-semibold">{a.category.replace("_", " ")}</p>
                      <h3 className="font-semibold text-forest mt-1 flex-1">{a.title}</h3>
                      <div className="flex items-center justify-between mt-4 text-sm text-muted">
                        <span className="flex items-center gap-1"><Clock size={14} /> {a.readingTimeMinutes} min read</span>
                        <ArrowRight size={16} className="text-emerald" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === "faqs" && (
        <div className="mt-8 space-y-4 max-w-3xl">
          {faqs.length === 0 ? (
            <EmptyState title="No FAQs yet" />
          ) : (
            faqs.map((f) => (
              <Card key={f._id}>
                <p className="font-semibold text-forest">{f.question}</p>
                <p className="text-sm text-muted mt-2">{f.answer}</p>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
