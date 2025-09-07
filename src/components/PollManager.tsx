import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DecentralizedChatService } from '@/services/DecentralizedChatService';
import { ChatPoll, PollOption, PollVote } from '@/types/chat';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Plus,
  Vote,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Eye,
  Download,
  X,
  EyeOff,
  UserCheck,
  Check,
  Calendar,
  AlertCircle,
  Settings,
  Trash2,
  Share2
} from 'lucide-react';

interface PollManagerProps {
  chatService: DecentralizedChatService;
  channelId: string;
  userId: string;
  className?: string;
}

export const PollManager: React.FC<PollManagerProps> = ({ 
  chatService, 
  channelId, 
  userId, 
  className 
}) => {
  const { toast } = useToast();
  const [polls, setPolls] = useState<ChatPoll[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDescription, setNewPollDescription] = useState('');
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '']);
  const [pollType, setPollType] = useState<'single-choice' | 'multiple-choice' | 'yes-no' | 'likert-scale'>('single-choice');
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [showVoters, setShowVoters] = useState(false);
  const [allowMultipleChoice, setAllowMultipleChoice] = useState(false);
  const [deadline, setDeadline] = useState<string>('');
  const [showUserVotes, setShowUserVotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPolls();
  }, [channelId]);

  const loadPolls = async () => {
    // In a real implementation, this would load polls from the chat service
    // For now, we'll use mock data
    setPolls([]);
  };

  const handleCreatePoll = async () => {
    if (!newPollTitle.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Poll title is required',
        variant: 'destructive'
      });
      return;
    }

    const validOptions = newPollOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast({
        title: 'Validation Error',
        description: 'At least 2 options are required',
        variant: 'destructive'
      });
      return;
    }

    const poll: Partial<ChatPoll> = {
      channelId,
      createdBy: userId,
      title: newPollTitle,
      description: newPollDescription,
      type: allowMultipleChoice ? 'multiple-choice' : 'single-choice',
      options: validOptions.map((option, index) => ({
        id: `option-${index}`,
        text: option,
        votes: []
      })),
      allowAnonymous,
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'active',
      metadata: {
        showVoters,
        allowMultipleChoice
      }
    };

    try {
      const createdPoll = await chatService.createPoll(poll);
      setPolls(prev => [createdPoll, ...prev]);
      
      // Reset form
      setNewPollTitle('');
      setNewPollDescription('');
      setNewPollOptions(['', '']);
      setDeadline('');
      setAllowAnonymous(false);
      setShowVoters(false);
      setAllowMultipleChoice(false);
      setIsCreating(false);
      
      toast({
        title: 'Poll Created',
        description: 'Your poll has been created successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create poll',
        variant: 'destructive'
      });
    }
  };

  const handleVote = async (pollId: string, optionIds: string[]) => {
    try {
      await chatService.votePoll(pollId, optionIds, userId);
      
      // Update local state
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => {
            if (optionIds.includes(option.id)) {
              return {
                ...option,
                votes: [...option.votes, {
                  userId,
                  optionId: option.id,
                  timestamp: new Date()
                }]
              };
            }
            return option;
          });
          
          return {
            ...poll,
            options: updatedOptions,
            results: {
              ...poll.results,
              totalVotes: poll.results.totalVotes + 1
            }
          };
        }
        return poll;
      }));
      
      toast({
        title: 'Vote Recorded',
        description: 'Your vote has been recorded',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    }
  };

  const addOption = () => {
    setNewPollOptions(prev => [...prev, '']);
  };

  const updateOption = (index: number, value: string) => {
    setNewPollOptions(prev => prev.map((opt, i) => i === index ? value : opt));
  };

  const removeOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(prev => prev.filter((_, i) => i !== index));
    }
  };

  const hasUserVoted = (poll: ChatPoll): boolean => {
    return poll.options.some(option => 
      option.votes.some(vote => vote.userId === userId)
    );
  };

  const getUserVoteOptions = (poll: ChatPoll): string[] => {
    return poll.options
      .filter(option => option.votes.some(vote => vote.userId === userId))
      .map(option => option.id);
  };

  const calculatePercentage = (votes: number, total: number): number => {
    return total === 0 ? 0 : Math.round((votes / total) * 100);
  };

  const PollCard: React.FC<{ poll: ChatPoll }> = ({ poll }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const userHasVoted = hasUserVoted(poll);
    const userVotes = getUserVoteOptions(poll);
    const isExpired = poll.deadline && new Date() > poll.deadline;
    const isClosed = poll.status === 'closed' || isExpired;

    useEffect(() => {
      if (userHasVoted) {
        setSelectedOptions(userVotes);
      }
    }, [poll]);

    const handleOptionToggle = (optionId: string) => {
      if (userHasVoted || isClosed) return;

      if (poll.type === 'single-choice' || poll.type === 'yes-no') {
        setSelectedOptions([optionId]);
      } else {
        setSelectedOptions(prev => 
          prev.includes(optionId)
            ? prev.filter(id => id !== optionId)
            : [...prev, optionId]
        );
      }
    };

    const submitVote = () => {
      if (selectedOptions.length > 0) {
        handleVote(poll.id, selectedOptions);
      }
    };

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{poll.title}</CardTitle>
              {poll.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {poll.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isClosed ? 'secondary' : 'default'}>
                {isClosed ? 'Closed' : 'Active'}
              </Badge>
              <Badge variant="outline">
                {poll.type.replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {poll.results.totalVotes} votes
            </div>
            {poll.deadline && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {isExpired ? 'Expired' : `Ends ${poll.deadline.toLocaleDateString()}`}
              </div>
            )}
            {userHasVoted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                You voted
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {poll.options.map(option => {
              const voteCount = option.votes.length;
              const percentage = calculatePercentage(voteCount, poll.results.totalVotes);
              const isSelected = selectedOptions.includes(option.id);
              const userVotedThis = userVotes.includes(option.id);

              return (
                <div
                  key={option.id}
                  className={cn(
                    "relative p-3 border rounded-lg cursor-pointer transition-colors",
                    isSelected && "border-primary bg-primary/5",
                    userVotedThis && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    (userHasVoted || isClosed) && "cursor-default"
                  )}
                  onClick={() => handleOptionToggle(option.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{option.text}</span>
                      {userVotedThis && (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {voteCount} ({percentage}%)
                    </span>
                  </div>
                  
                  {(userHasVoted || isClosed) && (
                    <Progress value={percentage} className="h-2 mb-2" />
                  )}
                  
                  {/* Show voters if enabled and not anonymous */}
                  {poll.metadata?.showVoters && !poll.allowAnonymous && (userHasVoted || isClosed) && option.votes.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowUserVotes(prev => ({
                            ...prev,
                            [option.id]: !prev[option.id]
                          }));
                        }}
                      >
                        {showUserVotes[option.id] ? (
                          <><EyeOff className="w-3 h-3 mr-1" />Hide voters</>
                        ) : (
                          <><Eye className="w-3 h-3 mr-1" />Show {option.votes.length} voter{option.votes.length !== 1 ? 's' : ''}</>
                        )}
                      </Button>
                      
                      {showUserVotes[option.id] && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {option.votes.map((vote, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <UserCheck className="w-3 h-3 mr-1" />
                              User {vote.userId.slice(-4)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {!userHasVoted && !isClosed && selectedOptions.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={submitVote}>
                <Vote className="w-4 h-4 mr-2" />
                Submit Vote
              </Button>
            </div>
          )}
          
          {(userHasVoted || isClosed) && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Total votes: {poll.results.totalVotes}</span>
                {poll.allowAnonymous && (
                  <Badge variant="outline">Anonymous voting</Badge>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Results
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Polls & Voting</h3>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      {/* Create Poll Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Create New Poll
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Poll Question</Label>
              <Input
                id="title"
                value={newPollTitle}
                onChange={(e) => setNewPollTitle(e.target.value)}
                placeholder="What would you like to ask?"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea
                id="description"
                value={newPollDescription}
                onChange={(e) => setNewPollDescription(e.target.value)}
                placeholder="Provide additional context..."
                className="mt-2"
                rows={3}
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Poll Options</Label>
              <div className="mt-2 space-y-3">
                {newPollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1"
                    />
                    {newPollOptions.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeOption(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addOption}
                  className="w-full"
                  disabled={newPollOptions.length >= 10}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option {newPollOptions.length >= 10 ? '(Max 10)' : ''}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="multiple-choice" className="text-sm font-medium">
                  Allow Multiple Choices
                </Label>
                <Switch
                  id="multiple-choice"
                  checked={allowMultipleChoice}
                  onCheckedChange={setAllowMultipleChoice}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-voters" className="text-sm font-medium">
                    Show Who Voted
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allow users to see who voted for each option
                  </p>
                </div>
                <Switch
                  id="show-voters"
                  checked={showVoters}
                  onCheckedChange={setShowVoters}
                  disabled={allowAnonymous}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymous" className="text-sm font-medium">
                    Anonymous Voting
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hide voter identities from everyone
                  </p>
                </div>
                <Switch
                  id="anonymous"
                  checked={allowAnonymous}
                  onCheckedChange={(checked) => {
                    setAllowAnonymous(checked);
                    if (checked) setShowVoters(false);
                  }}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="deadline" className="text-sm font-medium">Poll Deadline (Optional)</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePoll} className="min-w-[100px]">
                <Vote className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Polls Yet</h3>
              <p className="text-muted-foreground text-center">
                Create the first poll to start gathering opinions and making decisions together.
              </p>
            </CardContent>
          </Card>
        ) : (
          polls.map(poll => (
            <PollCard key={poll.id} poll={poll} />
          ))
        )}
      </div>
    </div>
  );
};
