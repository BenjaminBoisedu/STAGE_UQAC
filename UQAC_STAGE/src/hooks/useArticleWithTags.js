import { useState, useEffect } from 'react';
import { getDocumentById } from '../services/ArticlesServices/GetDocuments';
import { getCollection } from '../services/FirebaseOperations';

export const useArticleWithTags = (articleId) => {
    const [article, setArticle] = useState(null);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchArticleWithTags = async () => {
            try {
                const articleData = await getDocumentById("Publications", articleId);
                if (!articleData) {
                    setIsEmpty(true);
                    return;
                }

                const allTags = await getCollection("tag");

                if (articleData.tags && articleData.tags.length > 0) {
                    const articleTags = allTags.filter((tag) =>
                        articleData.tags.some((articleTag) => articleTag.id === tag.id)
                    );
                    setTags(articleTags);
                }

                setArticle(articleData);
            } catch (err) {
                setError(err.message);
                console.error("Erreur lors de la récupération:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticleWithTags();
    }, [articleId]);

    return { article, tags, loading, error, isEmpty };
};