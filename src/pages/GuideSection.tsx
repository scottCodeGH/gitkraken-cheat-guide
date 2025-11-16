import { useParams, Link, useNavigate } from 'react-router-dom';
import { guideContent } from '@/data/guideContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProgress } from '@/hooks/useProgress';
import { usePreferences } from '@/hooks/usePreferences';
import { CheckCircle2, Circle, Bookmark, BookmarkCheck, ArrowLeft, ArrowRight, Lightbulb, Keyboard, List } from 'lucide-react';
import { useEffect, useMemo } from 'react';

export function GuideSection() {
  const { sectionId, subsectionId } = useParams();
  const navigate = useNavigate();
  const { isCompleted, markAsCompleted, markAsIncomplete, isBookmarked, toggleBookmark, setLastVisited } = useProgress();
  const { preferences } = usePreferences();

  const section = guideContent.find((s) => s.id === sectionId);
  const subsection = section?.subsections?.find((ss) => ss.id === subsectionId);

  // If section has subsections and no subsection is selected, redirect to first subsection
  useEffect(() => {
    if (section && !subsectionId && section.subsections && section.subsections.length > 0) {
      navigate(`/guide/${sectionId}/${section.subsections[0].id}`, { replace: true });
    }
  }, [section, subsectionId, sectionId, navigate]);

  // Track last visited
  useEffect(() => {
    if (subsectionId) {
      setLastVisited(subsectionId);
    } else if (sectionId) {
      setLastVisited(sectionId);
    }
  }, [sectionId, subsectionId, setLastVisited]);

  if (!section) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Section not found</h1>
        <Button asChild className="mt-4">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  // Show loading during redirect
  if (!subsectionId && section.subsections && section.subsections.length > 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // If displaying subsection
  if (subsection) {
    const currentIndex = section.subsections!.findIndex((ss) => ss.id === subsectionId);
    const prevSubsection = currentIndex > 0 ? section.subsections![currentIndex - 1] : null;
    const nextSubsection = currentIndex < section.subsections!.length - 1 ? section.subsections![currentIndex + 1] : null;

    const completed = isCompleted(subsection.id);
    const bookmarked = isBookmarked(subsection.id);

    // Filter shortcuts based on selected OS
    const filteredShortcuts = useMemo(() => {
      if (!subsection.shortcuts) return [];
      return subsection.shortcuts.filter(
        (shortcut) => shortcut.platform === 'all' || shortcut.platform === preferences.operatingSystem
      );
    }, [subsection.shortcuts, preferences.operatingSystem]);

    // Handle marking as complete and navigating to next lesson
    const handleMarkComplete = () => {
      markAsCompleted(subsection.id);

      // Navigate to next subsection if available
      if (nextSubsection) {
        setTimeout(() => {
          navigate(`/guide/${sectionId}/${nextSubsection.id}`);
        }, 300); // Small delay for better UX
      } else {
        // If no more subsections, find next section
        const currentSectionIndex = guideContent.findIndex((s) => s.id === sectionId);
        if (currentSectionIndex < guideContent.length - 1) {
          const nextSection = guideContent[currentSectionIndex + 1];
          setTimeout(() => {
            navigate(`/guide/${nextSection.id}`);
          }, 300);
        } else {
          // All done! Go back to home
          setTimeout(() => {
            navigate('/');
          }, 300);
        }
      }
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to={`/guide/${sectionId}`} className="hover:text-foreground">{section.title}</Link>
          <span>/</span>
          <span className="text-foreground">{subsection.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">{subsection.title}</h1>
            <p className="text-muted-foreground">{section.title}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={bookmarked ? "default" : "outline"}
              size="icon"
              onClick={() => toggleBookmark(subsection.id)}
              title={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            >
              {bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </Button>
            <Button
              variant={completed ? "default" : "outline"}
              onClick={() => completed ? markAsIncomplete(subsection.id) : handleMarkComplete()}
            >
              {completed ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="mr-2 h-5 w-5" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{subsection.content}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tips, Shortcuts, Examples */}
        <Tabs defaultValue="tips" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips" disabled={!subsection.tips || subsection.tips.length === 0}>
              <Lightbulb className="mr-2 h-4 w-4" />
              Tips
            </TabsTrigger>
            <TabsTrigger value="shortcuts" disabled={filteredShortcuts.length === 0}>
              <Keyboard className="mr-2 h-4 w-4" />
              Shortcuts
            </TabsTrigger>
            <TabsTrigger value="examples" disabled={!subsection.examples || subsection.examples.length === 0}>
              <List className="mr-2 h-4 w-4" />
              Examples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tips">
            {subsection.tips && subsection.tips.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pro Tips</CardTitle>
                  <CardDescription>Best practices and helpful hints</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {subsection.tips.map((tip, index) => (
                      <li key={index} className="flex gap-3">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="shortcuts">
            {filteredShortcuts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keyboard Shortcuts</CardTitle>
                  <CardDescription>
                    Speed up your workflow - showing shortcuts for {preferences.operatingSystem === 'mac' ? 'macOS' : preferences.operatingSystem === 'linux' ? 'Linux' : 'Windows'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredShortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <span className="text-sm">{shortcut.description}</span>
                        <div className="flex gap-1">
                          {shortcut.keys.map((key, i) => (
                            <kbd key={i} className="px-2 py-1">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="examples">
            {subsection.examples && subsection.examples.length > 0 && (
              <div className="space-y-4">
                {subsection.examples.map((example, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{example.title}</CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 list-decimal list-inside">
                        {example.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          {prevSubsection ? (
            <Button asChild variant="outline">
              <Link to={`/guide/${sectionId}/${prevSubsection.id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {prevSubsection.title}
              </Link>
            </Button>
          ) : (
            <div />
          )}
          {nextSubsection ? (
            <Button asChild>
              <Link to={`/guide/${sectionId}/${nextSubsection.id}`}>
                {nextSubsection.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/">
                Back to Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Display section overview
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground">{section.title}</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{section.title}</h1>
        <p className="text-xl text-muted-foreground">{section.description}</p>
      </div>

      {/* Subsections */}
      {section.subsections && section.subsections.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Lessons</h2>
          <div className="grid gap-4">
            {section.subsections.map((subsection) => {
              const completed = isCompleted(subsection.id);
              return (
                <Link key={subsection.id} to={`/guide/${sectionId}/${subsection.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={completed ? "text-primary" : "text-muted-foreground"}>
                          {completed ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : (
                            <Circle className="h-6 w-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {subsection.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {subsection.content.substring(0, 150)}...
                          </CardDescription>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
