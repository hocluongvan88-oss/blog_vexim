"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle2, XCircle, Clock, TrendingUp, Mail, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase-client"

interface CronJobLog {
  id: string
  job_name: string
  status: "running" | "success" | "failed"
  started_at: string
  completed_at: string | null
  emails_sent: number | null
  execution_time_ms: number | null
  error_message: string | null
}

export default function CronMonitorPage() {
  const [logs, setLogs] = useState<CronJobLog[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRuns: 0,
    successRate: 0,
    avgExecutionTime: 0,
    totalEmailsSent: 0,
  })

  useEffect(() => {
    loadCronLogs()
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadCronLogs, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadCronLogs() {
    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from("cron_job_logs")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50)

      if (error) throw error

      if (data) {
        setLogs(data)
        calculateStats(data)
      }
    } catch (error) {
      console.error("Error loading cron logs:", error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats(logs: CronJobLog[]) {
    const completedLogs = logs.filter(log => log.status !== "running")
    const successfulLogs = logs.filter(log => log.status === "success")
    
    const totalRuns = completedLogs.length
    const successRate = totalRuns > 0 ? (successfulLogs.length / totalRuns) * 100 : 0
    
    const avgExecutionTime = completedLogs.length > 0
      ? completedLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / completedLogs.length
      : 0
    
    const totalEmailsSent = logs.reduce((sum, log) => sum + (log.emails_sent || 0), 0)

    setStats({
      totalRuns,
      successRate,
      avgExecutionTime,
      totalEmailsSent,
    })
  }

  function formatDuration(ms: number | null) {
    if (!ms) return "-"
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Cron Job Monitoring</h1>
        <p className="text-slate-600 mt-2">
          Monitor FDA alert digest cron jobs and email delivery
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRuns}</div>
            <p className="text-xs text-muted-foreground">Last 50 executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Job completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(stats.avgExecutionTime)}</div>
            <p className="text-xs text-muted-foreground">Execution time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmailsSent}</div>
            <p className="text-xs text-muted-foreground">Total delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Cron Jobs Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Executions</CardTitle>
          <CardDescription>Last 50 cron job runs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started At</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Emails</TableHead>
                  <TableHead>Error</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No cron job logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.job_name}</TableCell>
                      <TableCell>
                        {log.status === "success" && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Success
                          </Badge>
                        )}
                        {log.status === "failed" && (
                          <Badge variant="destructive">
                            <XCircle className="w-3 h-3 mr-1" />
                            Failed
                          </Badge>
                        )}
                        {log.status === "running" && (
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            Running
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{formatDate(log.started_at)}</TableCell>
                      <TableCell>{formatDuration(log.execution_time_ms)}</TableCell>
                      <TableCell>
                        {log.emails_sent !== null ? (
                          <span className="font-medium">{log.emails_sent}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {log.error_message ? (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-xs truncate max-w-xs" title={log.error_message}>
                              {log.error_message}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Last Update Info */}
      <div className="text-xs text-slate-500 text-center">
        Auto-refreshes every 30 seconds • Last updated: {new Date().toLocaleTimeString("vi-VN")}
      </div>
    </div>
  )
}
