import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { 
  Plus, ExternalLink, Calendar, DollarSign, Users, Mic, 
  MapPin, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronRight, 
  Trash2, RefreshCw, Download, Video, UserCheck, Newspaper, Heart, Rss, 
  Bookmark, Filter, LayoutDashboard
} from 'lucide-react'

// Multiple CORS proxies to try
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
]

// RSS Feed URLs
const RSS_FEEDS = [
  { name: 'SAMHSA News', url: 'https://www.samhsa.gov/rss/press-announcements.xml', category: 'policy' },
  { name: 'HHS News', url: 'https://www.hhs.gov/about/news/rss/index.xml', category: 'policy' },
  { name: 'Filter Magazine', url: 'https://filtermag.org/feed/', category: 'news' },
  { name: 'NIH NIDA', url: 'https://nida.nih.gov/rss/news-events.xml', category: 'policy' },
]

// Logo Component (SVG version of the Genius Recovery logo)
const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E53E3E" />
        <stop offset="50%" stopColor="#DD6B20" />
        <stop offset="100%" stopColor="#ED8936" />
      </linearGradient>
    </defs>
    <path 
      d="M50 88C50 88 15 60 15 35C15 20 27 10 42 10C47 10 50 15 50 15C50 15 53 10 58 10C73 10 85 20 85 35C85 60 50 88 50 88Z" 
      fill="url(#heartGradient)"
    />
    <path 
      d="M65 25C60 20 52 22 50 28C48 22 40 20 35 25C28 32 30 45 50 60C70 45 72 32 65 25Z" 
      fill="white" 
      fillOpacity="0.3"
    />
    <path 
      d="M30 40C25 35 25 28 30 23" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round"
      fill="none"
    />
    <path 
      d="M70 40C75 35 75 28 70 23" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="50" cy="45" r="8" fill="white" fillOpacity="0.9"/>
    <path 
      d="M45 45L48 48L55 41" 
      stroke="url(#heartGradient)" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

// Status Badge Component
const StatusBadge = ({ status }) => {
  const configs = {
    high: { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200', label: 'High' },
    medium: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Medium' },
    low: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Low' },
    pending: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Pending' },
    completed: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Done' },
    in_progress: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'In Progress' },
    prospect: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Prospect' },
    outreach: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Outreach' },
    pitched: { bg: 'bg-violet-50', color: 'text-violet-700', border: 'border-violet-200', label: 'Pitched' },
    active: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Active' },
    researching: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Researching' },
    pipeline: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Pipeline' },
    applying: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Applying' },
    submitted: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Submitted' },
    considering: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Considering' },
    registered: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Registered' },
    attending: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Attending' },
    scheduled: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Scheduled' },
    ideation: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Ideation' },
    pre_production: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Pre-Prod' },
    production: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Production' },
    post_production: { bg: 'bg-violet-50', color: 'text-violet-700', border: 'border-violet-200', label: 'Post-Prod' },
    review: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Review' },
    published: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Published' },
    available: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Available' },
    busy: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Busy' },
    unavailable: { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200', label: 'Unavailable' },
    unknown: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Unknown' },
    interested: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Interested' },
    confirmed: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmed' },
    declined: { bg: 'bg-red-50', color: 'text-red-700', border: 'border-red-200', label: 'Declined' },
    cultivating: { bg: 'bg-amber-50', color: 'text-amber-700', border: 'border-amber-200', label: 'Cultivating' },
    asked: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'Asked' },
    committed: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Committed' },
    received: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Received' },
    lapsed: { bg: 'bg-slate-50', color: 'text-slate-600', border: 'border-slate-200', label: 'Lapsed' },
    policy: { bg: 'bg-violet-50', color: 'text-violet-700', border: 'border-violet-200', label: 'Policy' },
    grants: { bg: 'bg-emerald-50', color: 'text-emerald-700', border: 'border-emerald-200', label: 'Grant' },
    news: { bg: 'bg-sky-50', color: 'text-sky-700', border: 'border-sky-200', label: 'News' },
  }
  const config = configs[status] || configs.low
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color} ${config.border}`}>
      {config.label}
    </span>
  )
}

// Section Header Component
const SectionHeader = ({ icon: Icon, title, count, onAdd, collapsed, onToggle, color = 'text-orange-500' }) => (
  <div 
    onClick={onToggle}
    className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl mb-3 cursor-pointer select-none hover:from-slate-100 hover:to-slate-50 transition-all duration-200 border border-slate-100"
  >
    <div className="flex items-center gap-3">
      {collapsed !== undefined && (
        <div className={`p-1 rounded-lg ${collapsed ? 'bg-slate-100' : 'bg-orange-50'}`}>
          {collapsed ? <ChevronRight size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-orange-500" />}
        </div>
      )}
      <div className={`p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500`}>
        <Icon size={18} className="text-white" />
      </div>
      <span className="font-semibold text-slate-800">{title}</span>
      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-sm">
        {count}
      </span>
    </div>
    {onAdd && (
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(); }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-sm hover:shadow"
      >
        <Plus size={14} /> Add
      </button>
    )}
  </div>
)

// Card wrapper for consistent styling
const Card = ({ children, className = '', highlight = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-4 bg-white rounded-xl border border-slate-100 mb-3 transition-all duration-200 hover:border-slate-200 hover:shadow-md ${highlight ? 'border-l-4 border-l-orange-500' : ''} ${className}`}
  >
    {children}
  </div>
)

// News Feed Item Component
const NewsFeedItem = ({ item, onSave }) => {
  const date = item.pubDate ? new Date(item.pubDate) : null
  const isRecent = date && (new Date() - date) < 7 * 24 * 60 * 60 * 1000
  
  return (
    <Card highlight={isRecent}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={item.category} />
            <span className="text-xs text-slate-400">{item.source}</span>
            {isRecent && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs font-semibold">
                NEW
              </span>
            )}
          </div>
          <a 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-slate-800 hover:text-orange-600 transition-colors line-clamp-2 block"
          >
            {item.title}
          </a>
          {item.description && (
            <p className="text-sm text-slate-500 mt-1.5 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            {date && <span>{date.toLocaleDateString()}</span>}
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1">
              Read more <ExternalLink size={10} />
            </a>
          </div>
        </div>
        <button
          onClick={() => onSave(item)}
          className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors group"
          title="Save to Policy Updates"
        >
          <Bookmark size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
        </button>
      </div>
    </Card>
  )
}

// Task Item Component
const TaskItem = ({ task, onUpdate, onDelete }) => {
  const isOverdue = new Date(task.due_date) < new Date() && task.status !== 'completed'
  
  return (
    <Card className={isOverdue ? 'bg-red-50/50 border-red-100' : ''}>
      <div className="flex items-start gap-3">
        <div className="pt-0.5">
          <input
            type="checkbox"
            checked={task.status === 'completed'}
            onChange={() => onUpdate({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' })}
            className="w-5 h-5 rounded-md border-2 border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-0 cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-medium ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {task.title}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
              <Clock size={12} />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
            <StatusBadge status={task.priority} />
            {task.notes && <span className="text-xs text-slate-400 truncate max-w-[200px]">{task.notes}</span>}
          </div>
        </div>
        <button onClick={() => onDelete(task.id)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors group">
          <Trash2 size={14} className="text-slate-300 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </Card>
  )
}

// Styled Select Component
const StyledSelect = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
)

// Grant Item Component
const GrantItem = ({ grant, onUpdate }) => {
  const deadline = grant.deadline
  const isRolling = deadline === 'Rolling'
  const deadlineDate = isRolling ? null : new Date(deadline)
  const daysUntil = deadlineDate ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24)) : null
  const isUrgent = daysUntil !== null && daysUntil <= 30 && daysUntil > 0
  const isPast = daysUntil !== null && daysUntil < 0

  return (
    <Card highlight={isUrgent}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold text-slate-800">{grant.title}</span>
            <StatusBadge status={grant.fit} />
          </div>
          <div className="text-sm text-slate-500 mb-2">{grant.funder}</div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-emerald-600 font-semibold">{grant.amount}</span>
            <span className={`flex items-center gap-1 ${isPast ? 'text-red-500' : isUrgent ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>
              <Calendar size={14} />
              {isRolling ? 'Rolling' : isPast ? 'Passed' : `${deadlineDate.toLocaleDateString()} (${daysUntil}d)`}
            </span>
          </div>
          {grant.requirements && <div className="text-xs text-slate-400 mt-2">{grant.requirements}</div>}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <StyledSelect
            value={grant.status}
            onChange={(e) => onUpdate({ ...grant, status: e.target.value })}
            options={[
              { value: 'pipeline', label: 'Pipeline' },
              { value: 'researching', label: 'Researching' },
              { value: 'applying', label: 'Applying' },
              { value: 'submitted', label: 'Submitted' },
            ]}
          />
          {grant.link && (
            <a href={grant.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 p-1">
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

// Partner Item Component
const PartnerItem = ({ partner, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{partner.name}</span>
          <StatusBadge status={partner.fit} />
        </div>
        <div className="text-sm text-slate-500 mb-2 flex items-center gap-1.5">
          <MapPin size={14} className="text-slate-400" /> {partner.location}
        </div>
        <div className="text-sm text-slate-600 mb-2">{partner.description}</div>
        {partner.contact && <div className="text-sm text-orange-600 font-medium">{partner.contact}</div>}
        {partner.service_needs?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {partner.service_needs.map((need, i) => (
              <span key={i} className="px-2 py-1 bg-slate-100 rounded-lg text-xs text-slate-600">{need}</span>
            ))}
          </div>
        )}
      </div>
      <StyledSelect
        value={partner.status}
        onChange={(e) => onUpdate({ ...partner, status: e.target.value })}
        options={[
          { value: 'prospect', label: 'Prospect' },
          { value: 'outreach', label: 'Outreach' },
          { value: 'active', label: 'Active' },
        ]}
      />
    </div>
  </Card>
)

// Media Item Component
const MediaItem = ({ media, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{media.name}</span>
          <StatusBadge status={media.fit} />
        </div>
        <div className="text-sm text-slate-500 mb-1">Host: {media.host} • {media.platform}</div>
        <div className="text-sm text-slate-600">{media.notes}</div>
      </div>
      <StyledSelect
        value={media.status}
        onChange={(e) => onUpdate({ ...media, status: e.target.value })}
        options={[
          { value: 'prospect', label: 'Prospect' },
          { value: 'pitched', label: 'Pitched' },
          { value: 'scheduled', label: 'Scheduled' },
          { value: 'completed', label: 'Completed' },
        ]}
      />
    </div>
  </Card>
)

// Event Item Component
const EventItem = ({ event, onUpdate }) => {
  const daysUntil = Math.ceil((new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24))
  const isPast = daysUntil < 0
  const isUpcoming = daysUntil >= 0 && daysUntil <= 30

  return (
    <Card className={isPast ? 'opacity-60' : ''} highlight={isUpcoming}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-semibold text-slate-800">{event.name}</span>
            <StatusBadge status={event.priority} />
          </div>
          <div className="text-sm text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Calendar size={14} className="text-slate-400" />
            {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
            {!isPast && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${isUpcoming ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {daysUntil} days
              </span>
            )}
          </div>
          <div className="text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" /> {event.location}
          </div>
          {event.notes && <div className="text-xs text-slate-400 mt-2">{event.notes}</div>}
        </div>
        <StyledSelect
          value={event.status}
          onChange={(e) => onUpdate({ ...event, status: e.target.value })}
          options={[
            { value: 'considering', label: 'Considering' },
            { value: 'registered', label: 'Registered' },
            { value: 'attending', label: 'Attending' },
          ]}
        />
      </div>
    </Card>
  )
}

// Policy Item Component
const PolicyItem = ({ policy }) => (
  <Card highlight>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{policy.title}</span>
          <StatusBadge status={policy.priority} />
        </div>
        <div className="text-xs text-slate-400 mb-2">{new Date(policy.date).toLocaleDateString()}</div>
        <div className="text-sm text-slate-600 mb-3">{policy.description}</div>
        {policy.action_items?.length > 0 && (
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Action Items</div>
            {policy.action_items.map((item, i) => (
              <div key={i} className="text-sm text-slate-700 flex items-start gap-2 mb-1 last:mb-0">
                <span className="text-orange-500 mt-0.5">→</span> {item}
              </div>
            ))}
          </div>
        )}
      </div>
      {policy.link && (
        <a href={policy.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 p-2 hover:bg-slate-50 rounded-lg transition-colors">
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  </Card>
)

// Content Pipeline Item Component
const ContentItem = ({ content, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{content.title}</span>
          <span className="px-2 py-0.5 bg-violet-100 text-violet-700 border border-violet-200 rounded-full text-xs font-medium">
            {content.content_type}
          </span>
        </div>
        {content.partner_client && <div className="text-sm text-slate-500 mb-1">For: {content.partner_client}</div>}
        {content.description && <div className="text-sm text-slate-600 mb-2">{content.description}</div>}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {content.platform && <span>Platform: {content.platform}</span>}
          {content.due_date && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {new Date(content.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
        {content.notes && <div className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1 rounded-lg inline-block">{content.notes}</div>}
      </div>
      <StyledSelect
        value={content.status}
        onChange={(e) => onUpdate({ ...content, status: e.target.value })}
        options={[
          { value: 'ideation', label: 'Ideation' },
          { value: 'pre_production', label: 'Pre-Production' },
          { value: 'production', label: 'Production' },
          { value: 'post_production', label: 'Post-Production' },
          { value: 'review', label: 'Review' },
          { value: 'published', label: 'Published' },
        ]}
      />
    </div>
  </Card>
)

// Expert Item Component
const ExpertItem = ({ expert, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{expert.name}</span>
          <StatusBadge status={expert.availability} />
        </div>
        <div className="text-sm text-slate-600 mb-1">{expert.expertise}</div>
        {expert.organization && <div className="text-sm text-slate-500 mb-2">{expert.organization}</div>}
        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          {expert.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-400" />{expert.location}
            </span>
          )}
          {expert.contact_email && <span className="text-orange-600">{expert.contact_email}</span>}
        </div>
        {expert.notes && <div className="text-sm text-slate-500 mt-2">{expert.notes}</div>}
      </div>
      <StyledSelect
        value={expert.availability}
        onChange={(e) => onUpdate({ ...expert, availability: e.target.value })}
        options={[
          { value: 'available', label: 'Available' },
          { value: 'busy', label: 'Busy' },
          { value: 'unavailable', label: 'Unavailable' },
          { value: 'unknown', label: 'Unknown' },
        ]}
      />
    </div>
  </Card>
)

// Press Item Component
const PressItem = ({ press, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{press.outlet}</span>
          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 border border-sky-200 rounded-full text-xs font-medium">
            {press.coverage_type}
          </span>
        </div>
        {press.contact_name && <div className="text-sm text-slate-500 mb-1">Contact: {press.contact_name}</div>}
        {press.topic && <div className="text-sm text-slate-600 mb-1">Topic: {press.topic}</div>}
        {press.contact_email && <div className="text-sm text-orange-600">{press.contact_email}</div>}
        {press.notes && <div className="text-xs text-slate-400 mt-2">{press.notes}</div>}
        {press.link && (
          <a href={press.link} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1 mt-2">
            <ExternalLink size={12} /> View Coverage
          </a>
        )}
      </div>
      <StyledSelect
        value={press.status}
        onChange={(e) => onUpdate({ ...press, status: e.target.value })}
        options={[
          { value: 'prospect', label: 'Prospect' },
          { value: 'pitched', label: 'Pitched' },
          { value: 'interested', label: 'Interested' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'published', label: 'Published' },
          { value: 'declined', label: 'Declined' },
        ]}
      />
    </div>
  </Card>
)

// Donor Item Component
const DonorItem = ({ donor, onUpdate }) => (
  <Card>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="font-semibold text-slate-800">{donor.name}</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
            {donor.donor_type}
          </span>
        </div>
        {donor.contact_name && <div className="text-sm text-slate-500 mb-2">{donor.contact_name}</div>}
        <div className="flex flex-wrap gap-4 text-sm">
          {donor.amount_potential && <span className="text-emerald-600 font-semibold">Potential: {donor.amount_potential}</span>}
          {donor.amount_given && <span className="text-slate-600">Given: {donor.amount_given}</span>}
        </div>
        {donor.last_contact && <div className="text-xs text-slate-400 mt-2">Last contact: {new Date(donor.last_contact).toLocaleDateString()}</div>}
        {donor.next_action && <div className="text-xs text-amber-600 mt-1 bg-amber-50 px-2 py-1 rounded-lg inline-block">Next: {donor.next_action}</div>}
        {donor.notes && <div className="text-xs text-slate-400 mt-2">{donor.notes}</div>}
      </div>
      <StyledSelect
        value={donor.status}
        onChange={(e) => onUpdate({ ...donor, status: e.target.value })}
        options={[
          { value: 'prospect', label: 'Prospect' },
          { value: 'cultivating', label: 'Cultivating' },
          { value: 'asked', label: 'Asked' },
          { value: 'committed', label: 'Committed' },
          { value: 'received', label: 'Received' },
          { value: 'declined', label: 'Declined' },
          { value: 'lapsed', label: 'Lapsed' },
        ]}
      />
    </div>
  </Card>
)

// Add Task Modal
const AddTaskModal = ({ onClose, onAdd }) => {
  const [task, setTask] = useState({
    title: '',
    category: 'general',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    notes: ''
  })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">Add Task</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <input
            type="date"
            value={task.due_date}
            onChange={(e) => setTask({ ...task, due_date: e.target.value })}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select
              value={task.category}
              onChange={(e) => setTask({ ...task, category: e.target.value })}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            >
              <option value="grants">Grants</option>
              <option value="partners">Partners</option>
              <option value="media">Media</option>
              <option value="events">Events</option>
              <option value="content">Content</option>
              <option value="donors">Donors</option>
              <option value="press">Press</option>
              <option value="general">General</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={task.notes}
            onChange={(e) => setTask({ ...task, notes: e.target.value })}
            className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
          <button
            onClick={() => {
              if (task.title) {
                onAdd(task)
                onClose()
              }
            }}
            className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  )
}

// Parse RSS XML
const parseRSS = (xml, source, category) => {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(xml, 'text/xml')
    const parseError = doc.querySelector('parsererror')
    if (parseError) return []
    const items = doc.querySelectorAll('item')
    return Array.from(items).slice(0, 10).map(item => ({
      title: item.querySelector('title')?.textContent?.trim() || '',
      link: item.querySelector('link')?.textContent?.trim() || '',
      description: (item.querySelector('description')?.textContent || '').replace(/<[^>]*>/g, '').trim().slice(0, 200),
      pubDate: item.querySelector('pubDate')?.textContent || '',
      source,
      category
    })).filter(item => item.title && item.link)
  } catch (e) {
    return []
  }
}

// Fetch with proxy fallback
const fetchWithProxy = async (url, proxies) => {
  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy + encodeURIComponent(url), {
        headers: { 'Accept': 'application/rss+xml, application/xml, text/xml' }
      })
      if (response.ok) {
        const text = await response.text()
        if (text.includes('<rss') || text.includes('<feed') || text.includes('<item')) {
          return text
        }
      }
    } catch (e) {
      continue
    }
  }
  return null
}

// Main Dashboard Component
export default function Dashboard() {
  const [data, setData] = useState({
    policy: [], grants: [], partners: [], media: [], events: [],
    tasks: [], content: [], experts: [], press: [], donors: []
  })
  const [newsFeed, setNewsFeed] = useState([])
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsError, setNewsError] = useState(null)
  const [newsFilter, setNewsFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState({})
  const [showAddTask, setShowAddTask] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => { loadData() }, [])
  useEffect(() => { if (activeTab === 'news' && newsFeed.length === 0) loadNewsFeed() }, [activeTab])

  const loadNewsFeed = async () => {
    setNewsLoading(true)
    setNewsError(null)
    const allItems = []
    let successCount = 0
    for (const feed of RSS_FEEDS) {
      try {
        const xml = await fetchWithProxy(feed.url, CORS_PROXIES)
        if (xml) {
          const items = parseRSS(xml, feed.name, feed.category)
          if (items.length > 0) { allItems.push(...items); successCount++ }
        }
      } catch (error) { console.error(error) }
    }
    if (successCount === 0) setNewsError('Unable to load news feeds. Try refreshing.')
    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    setNewsFeed(allItems)
    setNewsLoading(false)
  }

  const loadData = async () => {
    setLoading(true)
    if (!supabase) { setLoading(false); return }
    try {
      const [policyRes, grantsRes, partnersRes, mediaRes, eventsRes, tasksRes, contentRes, expertsRes, pressRes, donorsRes, settingsRes] = await Promise.all([
        supabase.from('policy_updates').select('*').order('date', { ascending: false }),
        supabase.from('grants').select('*').order('deadline', { ascending: true }),
        supabase.from('partners').select('*').order('name'),
        supabase.from('media').select('*').order('name'),
        supabase.from('events').select('*').order('start_date'),
        supabase.from('tasks').select('*').order('due_date'),
        supabase.from('content_pipeline').select('*').order('created_at', { ascending: false }),
        supabase.from('experts').select('*').order('name'),
        supabase.from('press').select('*').order('created_at', { ascending: false }),
        supabase.from('donors').select('*').order('name'),
        supabase.from('settings').select('*').eq('key', 'last_updated').single()
      ])
      setData({
        policy: policyRes.data || [], grants: grantsRes.data || [], partners: partnersRes.data || [],
        media: mediaRes.data || [], events: eventsRes.data || [], tasks: tasksRes.data || [],
        content: contentRes.data || [], experts: expertsRes.data || [], press: pressRes.data || [],
        donors: donorsRes.data || []
      })
      if (settingsRes.data?.value?.timestamp) setLastUpdated(new Date(settingsRes.data.value.timestamp))
    } catch (error) { console.error(error) }
    setLoading(false)
  }

  const updateItem = async (table, item) => {
    try {
      const { error } = await supabase.from(table).update(item).eq('id', item.id)
      if (!error) {
        const tableKey = table === 'content_pipeline' ? 'content' : table
        setData(prev => ({ ...prev, [tableKey]: prev[tableKey].map(i => i.id === item.id ? item : i) }))
        await supabase.from('settings').upsert({ key: 'last_updated', value: { timestamp: new Date().toISOString() } })
        setLastUpdated(new Date())
      }
    } catch (error) { console.error(error) }
  }

  const addTask = async (task) => {
    try {
      const { data: newTask, error } = await supabase.from('tasks').insert([task]).select().single()
      if (!error && newTask) setData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }))
    } catch (error) { console.error(error) }
  }

  const deleteTask = async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (!error) setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }))
    } catch (error) { console.error(error) }
  }

  const saveNewsItem = async (item) => {
    try {
      const newItem = {
        title: item.title, description: item.description, priority: 'medium',
        date: item.pubDate ? new Date(item.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        link: item.link, action_items: []
      }
      const { data: savedItem, error } = await supabase.from('policy_updates').insert([newItem]).select().single()
      if (!error && savedItem) {
        setData(prev => ({ ...prev, policy: [savedItem, ...prev.policy] }))
        alert('Saved to Policy Updates!')
      }
    } catch (error) { alert('Error saving item') }
  }

  const toggleCollapse = (section) => setCollapsed(prev => ({ ...prev, [section]: !prev[section] }))
  
  const exportPDF = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const pendingTasksList = data.tasks.filter(t => t.status !== 'completed').sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    const overdueTasksList = pendingTasksList.filter(t => new Date(t.due_date) < new Date())
    const activeGrantsList = data.grants.filter(g => g.status !== 'submitted' && g.status !== 'declined')
    const upcomingEventsList = data.events.filter(e => new Date(e.start_date) >= new Date()).slice(0, 5)
    const activePartners = data.partners.filter(p => p.status === 'active' || p.status === 'outreach')
    const activeContentList = data.content.filter(c => c.status !== 'published')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Genius Recovery - Executive Summary</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; padding-bottom: 16px; border-bottom: 3px solid #ea580c; }
          .logo { width: 50px; height: 50px; background: linear-gradient(135deg, #ea580c, #dc2626); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; }
          .header-text h1 { font-size: 24px; color: #0f172a; }
          .header-text p { font-size: 12px; color: #64748b; }
          .date { font-size: 12px; color: #64748b; margin-bottom: 24px; }
          .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 32px; }
          .stat { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: 700; color: #ea580c; }
          .stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .section { margin-bottom: 28px; }
          .section-title { font-size: 14px; font-weight: 700; color: #ea580c; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #fed7aa; }
          .item { padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
          .item:last-child { border-bottom: none; }
          .item-title { font-weight: 600; color: #0f172a; font-size: 13px; }
          .item-meta { font-size: 11px; color: #64748b; margin-top: 2px; }
          .item-meta span { margin-right: 12px; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600; }
          .badge-high { background: #fee2e2; color: #dc2626; }
          .badge-medium { background: #fef3c7; color: #d97706; }
          .badge-low { background: #e0f2fe; color: #0284c7; }
          .badge-overdue { background: #dc2626; color: white; }
          .overdue { background: #fef2f2; padding: 8px; border-radius: 6px; margin-bottom: 4px; }
          .empty { color: #94a3b8; font-style: italic; font-size: 12px; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; text-align: center; }
          @media print { body { padding: 20px; } .stats { grid-template-columns: repeat(5, 1fr); } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">GR</div>
          <div class="header-text">
            <h1>Genius Recovery</h1>
            <p>Executive Director Summary</p>
          </div>
        </div>
        <p class="date">Generated: ${today}</p>
        
        <div class="stats">
          <div class="stat"><div class="stat-value">${pendingTasksList.length}</div><div class="stat-label">Tasks</div></div>
          <div class="stat"><div class="stat-value">${activeContentList.length}</div><div class="stat-label">In Production</div></div>
          <div class="stat"><div class="stat-value">${activeGrantsList.length}</div><div class="stat-label">Active Grants</div></div>
          <div class="stat"><div class="stat-value">${data.partners.length}</div><div class="stat-label">Partners</div></div>
          <div class="stat"><div class="stat-value">${data.donors.length}</div><div class="stat-label">Donors</div></div>
        </div>

        ${overdueTasksList.length > 0 ? `
        <div class="section">
          <div class="section-title">⚠️ Overdue Tasks (${overdueTasksList.length})</div>
          ${overdueTasksList.map(t => `
            <div class="item overdue">
              <div class="item-title">${t.title}</div>
              <div class="item-meta">
                <span class="badge badge-overdue">Due: ${new Date(t.due_date).toLocaleDateString()}</span>
                ${t.notes ? `<span>${t.notes}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">📋 Pending Tasks (${pendingTasksList.length})</div>
          ${pendingTasksList.length > 0 ? pendingTasksList.slice(0, 10).map(t => `
            <div class="item">
              <div class="item-title">${t.title}</div>
              <div class="item-meta">
                <span>Due: ${new Date(t.due_date).toLocaleDateString()}</span>
                <span class="badge badge-${t.priority}">${t.priority}</span>
              </div>
            </div>
          `).join('') : '<p class="empty">No pending tasks</p>'}
        </div>

        <div class="section">
          <div class="section-title">🎬 Content In Production (${activeContentList.length})</div>
          ${activeContentList.length > 0 ? activeContentList.map(c => `
            <div class="item">
              <div class="item-title">${c.title}</div>
              <div class="item-meta">
                <span>${c.content_type}</span>
                <span>Status: ${c.status.replace('_', ' ')}</span>
                ${c.partner_client ? `<span>For: ${c.partner_client}</span>` : ''}
              </div>
            </div>
          `).join('') : '<p class="empty">No active productions</p>'}
        </div>

        <div class="section">
          <div class="section-title">💰 Grant Pipeline (${activeGrantsList.length})</div>
          ${activeGrantsList.length > 0 ? activeGrantsList.map(g => `
            <div class="item">
              <div class="item-title">${g.title}</div>
              <div class="item-meta">
                <span>${g.funder}</span>
                <span>${g.amount}</span>
                <span>Deadline: ${g.deadline}</span>
                <span class="badge badge-${g.fit}">${g.fit} fit</span>
              </div>
            </div>
          `).join('') : '<p class="empty">No active grants</p>'}
        </div>

        <div class="section">
          <div class="section-title">🤝 Active Partners (${activePartners.length})</div>
          ${activePartners.length > 0 ? activePartners.map(p => `
            <div class="item">
              <div class="item-title">${p.name}</div>
              <div class="item-meta">
                <span>${p.location}</span>
                <span>Status: ${p.status}</span>
              </div>
            </div>
          `).join('') : '<p class="empty">No active partners</p>'}
        </div>

        <div class="section">
          <div class="section-title">📅 Upcoming Events (${upcomingEventsList.length})</div>
          ${upcomingEventsList.length > 0 ? upcomingEventsList.map(e => `
            <div class="item">
              <div class="item-title">${e.name}</div>
              <div class="item-meta">
                <span>${new Date(e.start_date).toLocaleDateString()} - ${new Date(e.end_date).toLocaleDateString()}</span>
                <span>${e.location}</span>
              </div>
            </div>
          `).join('') : '<p class="empty">No upcoming events</p>'}
        </div>

        <div class="footer">
          Genius Recovery • geniusrecovery.org • Generated from ED Dashboard
        </div>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <Logo size={64} />
            <div className="absolute inset-0 animate-ping opacity-30"><Logo size={64} /></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingTasks = data.tasks.filter(t => t.status !== 'completed')
  const overdueTasks = pendingTasks.filter(t => new Date(t.due_date) < new Date())
  const upcomingGrants = data.grants.filter(g => {
    if (g.deadline === 'Rolling') return true
    const days = Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 60
  })
  const upcomingEvents = data.events.filter(e => {
    const days = Math.ceil((new Date(e.start_date) - new Date()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 90
  })
  const activeContent = data.content.filter(c => c.status !== 'published')
  const filteredNews = newsFilter === 'all' ? newsFeed : newsFeed.filter(item => item.category === newsFilter)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'news', label: 'News', icon: Rss },
    { id: 'content', label: 'Content', icon: Video },
    { id: 'grants', label: 'Grants', icon: DollarSign },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'donors', label: 'Donors', icon: Heart },
    { id: 'media', label: 'Media', icon: Mic },
    { id: 'press', label: 'Press', icon: Newspaper },
    { id: 'experts', label: 'Experts', icon: UserCheck },
    { id: 'events', label: 'Events', icon: Calendar }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Logo size={48} />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Genius Recovery</h1>
                <p className="text-sm text-slate-400">Executive Director Dashboard</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                onClick={exportPDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all"
              >
                <Download size={16} /> Export PDF
              </button>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-slate-400 mb-4">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { value: pendingTasks.length, label: 'Tasks', icon: CheckCircle, color: 'from-orange-500 to-red-500' },
              { value: activeContent.length, label: 'In Production', icon: Video, color: 'from-violet-500 to-purple-500' },
              { value: upcomingGrants.length, label: 'Grants', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
              { value: data.partners.length, label: 'Partners', icon: Users, color: 'from-sky-500 to-blue-500' },
              { value: data.donors.length, label: 'Donors', icon: Heart, color: 'from-pink-500 to-rose-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-slate-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Alert Banner */}
        {overdueTasks.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-sm">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <span className="text-sm text-red-800 font-medium">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''} need attention
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-6 shadow-sm">
          
          {activeTab === 'news' && (
            <>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500">
                    <Rss size={20} className="text-white" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">News Feed</span>
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {filteredNews.length}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-1.5">
                    <Filter size={14} className="text-slate-400" />
                    <select
                      value={newsFilter}
                      onChange={(e) => setNewsFilter(e.target.value)}
                      className="bg-transparent text-sm font-medium text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="all">All News</option>
                      <option value="policy">Policy</option>
                      <option value="news">Industry</option>
                    </select>
                  </div>
                  <button
                    onClick={loadNewsFeed}
                    disabled={newsLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 shadow-lg shadow-orange-500/25"
                  >
                    <RefreshCw size={14} className={newsLoading ? 'animate-spin' : ''} /> Refresh
                  </button>
                </div>
              </div>
              
              {newsLoading ? (
                <div className="text-center py-16">
                  <div className="relative inline-block">
                    <Logo size={48} />
                    <div className="absolute inset-0 animate-ping opacity-30"><Logo size={48} /></div>
                  </div>
                  <p className="mt-4 text-slate-500 font-medium">Loading news feeds...</p>
                </div>
              ) : newsError ? (
                <div className="text-center py-16">
                  <div className="p-4 bg-amber-100 rounded-2xl inline-block mb-4">
                    <AlertTriangle size={32} className="text-amber-600" />
                  </div>
                  <p className="text-slate-600 mb-4">{newsError}</p>
                  <button onClick={loadNewsFeed} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25">
                    Try Again
                  </button>
                </div>
              ) : filteredNews.length > 0 ? (
                <div>{filteredNews.map((item, i) => <NewsFeedItem key={`${item.source}-${i}`} item={item} onSave={saveNewsItem} />)}</div>
              ) : (
                <div className="text-center py-16">
                  <div className="p-4 bg-slate-100 rounded-2xl inline-block mb-4">
                    <Rss size={32} className="text-slate-400" />
                  </div>
                  <p className="text-slate-500 mb-4">No news items found.</p>
                  <button onClick={loadNewsFeed} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25">
                    Load News
                  </button>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'overview' && (
            <>
              <SectionHeader icon={CheckCircle} title="Action Items" count={pendingTasks.length} onAdd={() => setShowAddTask(true)} collapsed={collapsed.tasks} onToggle={() => toggleCollapse('tasks')} />
              {!collapsed.tasks && (
                <div className="mb-8">
                  {pendingTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).map(task => (
                    <TaskItem key={task.id} task={task} onUpdate={(t) => updateItem('tasks', t)} onDelete={deleteTask} />
                  ))}
                  {pendingTasks.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No pending tasks — nice work! 🎉</p>}
                </div>
              )}
              <SectionHeader icon={Video} title="Content In Production" count={activeContent.length} collapsed={collapsed.content} onToggle={() => toggleCollapse('content')} />
              {!collapsed.content && (
                <div className="mb-8">
                  {activeContent.map(c => <ContentItem key={c.id} content={c} onUpdate={(item) => updateItem('content_pipeline', item)} />)}
                  {activeContent.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No active productions</p>}
                </div>
              )}
              <SectionHeader icon={AlertTriangle} title="Policy Updates" count={data.policy.length} collapsed={collapsed.policy} onToggle={() => toggleCollapse('policy')} />
              {!collapsed.policy && <div className="mb-8">{data.policy.map(p => <PolicyItem key={p.id} policy={p} />)}</div>}
              <SectionHeader icon={Clock} title="Upcoming Deadlines" count={upcomingGrants.length + upcomingEvents.length} collapsed={collapsed.deadlines} onToggle={() => toggleCollapse('deadlines')} />
              {!collapsed.deadlines && (
                <div>
                  {upcomingGrants.slice(0, 3).map(g => <GrantItem key={g.id} grant={g} onUpdate={(item) => updateItem('grants', item)} />)}
                  {upcomingEvents.slice(0, 2).map(e => <EventItem key={e.id} event={e} onUpdate={(item) => updateItem('events', item)} />)}
                </div>
              )}
            </>
          )}

          {activeTab === 'content' && (
            <>
              <SectionHeader icon={Video} title="Content Pipeline" count={data.content.length} />
              {data.content.map(c => <ContentItem key={c.id} content={c} onUpdate={(item) => updateItem('content_pipeline', item)} />)}
              {data.content.length === 0 && <p className="text-sm text-slate-400 text-center py-12">No content in pipeline.</p>}
            </>
          )}

          {activeTab === 'grants' && (
            <>
              <SectionHeader icon={DollarSign} title="Grant Pipeline" count={data.grants.length} />
              {data.grants.map(g => <GrantItem key={g.id} grant={g} onUpdate={(item) => updateItem('grants', item)} />)}
            </>
          )}

          {activeTab === 'partners' && (
            <>
              <SectionHeader icon={Users} title="Partner Organizations" count={data.partners.length} />
              {data.partners.map(p => <PartnerItem key={p.id} partner={p} onUpdate={(item) => updateItem('partners', item)} />)}
            </>
          )}

          {activeTab === 'donors' && (
            <>
              <SectionHeader icon={Heart} title="Donors & Funders" count={data.donors.length} />
              {data.donors.map(d => <DonorItem key={d.id} donor={d} onUpdate={(item) => updateItem('donors', item)} />)}
              {data.donors.length === 0 && <p className="text-sm text-slate-400 text-center py-12">No donors yet.</p>}
            </>
          )}

          {activeTab === 'media' && (
            <>
              <SectionHeader icon={Mic} title="Media Opportunities" count={data.media.length} />
              {data.media.map(m => <MediaItem key={m.id} media={m} onUpdate={(item) => updateItem('media', item)} />)}
            </>
          )}

          {activeTab === 'press' && (
            <>
              <SectionHeader icon={Newspaper} title="Press & Coverage" count={data.press.length} />
              {data.press.map(p => <PressItem key={p.id} press={p} onUpdate={(item) => updateItem('press', item)} />)}
              {data.press.length === 0 && <p className="text-sm text-slate-400 text-center py-12">No press items yet.</p>}
            </>
          )}

          {activeTab === 'experts' && (
            <>
              <SectionHeader icon={UserCheck} title="Expert Network" count={data.experts.length} />
              {data.experts.map(e => <ExpertItem key={e.id} expert={e} onUpdate={(item) => updateItem('experts', item)} />)}
              {data.experts.length === 0 && <p className="text-sm text-slate-400 text-center py-12">No experts yet.</p>}
            </>
          )}

          {activeTab === 'events' && (
            <>
              <SectionHeader icon={Calendar} title="Events & Conferences" count={data.events.length} />
              {data.events.map(e => <EventItem key={e.id} event={e} onUpdate={(item) => updateItem('events', item)} />)}
            </>
          )}
        </div>
      </div>

      {showAddTask && <AddTaskModal onClose={() => setShowAddTask(false)} onAdd={addTask} />}
    </div>
  )
}
