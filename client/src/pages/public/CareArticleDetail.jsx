import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react";
import { api } from "../../services/api.js";
import Spinner from "../../components/ui/Spinner.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function CareArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api.get(`/care/articles/${slug}`)
      .then(({ data }) => setArticle(data.data.article))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner label="Loading article..." />;

  if (notFound || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-lg font-semibold text-forest">Article not found</p>
        <Link to="/care" className="text-emerald font-medium mt-3 inline-block">← Back to Care Guide</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link to="/care" className="inline-flex items-center gap-1 text-emerald text-sm font-medium mb-6">
        <ArrowLeft size={16} /> Back to Care Guide
      </Link>

      <Badge tone="mint">{article.category.replace("_", " ")}</Badge>
      <h1 className="text-3xl font-extrabold text-forest mt-4">{article.title}</h1>
      <div className="flex items-center gap-4 text-sm text-muted mt-3">
        {article.author && <span>By {article.author}</span>}
        <span className="flex items-center gap-1"><Clock size={14} /> {article.readingTimeMinutes} min read</span>
      </div>

      <div className="aspect-video bg-mint/40 rounded-2xl my-8 flex items-center justify-center text-forest/40 text-sm">
        No image
      </div>

      <div className="prose prose-sm max-w-none text-ink leading-relaxed whitespace-pre-line">
        {article.content}
      </div>
    </div>
  );
}
