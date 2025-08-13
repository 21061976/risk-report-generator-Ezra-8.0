const generateHTMLReport = (reportData, options = {}) => {
  try {
    // Replace template variables
    let htmlContent = getEmbeddedTemplate();

    // Basic project info
    htmlContent = htmlContent.replace(/\{\{PROJECT_NAME\}\}/g, reportData.projectName || '');
    htmlContent = htmlContent.replace(/\{\{PROJECT_DESCRIPTION\}\}/g, reportData.projectScope || '');
    htmlContent = htmlContent.replace(/\{\{ORGANIZATION\}\}/g, reportData.organization || '');
    htmlContent = htmlContent.replace(/\{\{PROJECT_MANAGER\}\}/g, reportData.projectManager || '');
    htmlContent = htmlContent.replace(/\{\{PROJECT_SCOPE\}\}/g, reportData.projectScope || '');
    htmlContent = htmlContent.replace(/\{\{TIMELINE\}\}/g, reportData.timeline || '');
    htmlContent = htmlContent.replace(/\{\{PROJECT_TYPE\}\}/g, reportData.projectType || '');
    htmlContent = htmlContent.replace(/\{\{REGULATORY_PARTNERS\}\}/g, reportData.regulatoryPartners || '');

    // Goals
    const goalsHtml = reportData.goals.map(goal => 
      `<div class="goal-item editable">
        <strong>${goal.title}</strong><br>
        ${goal.description}
      </div>`
    ).join('');
    htmlContent = htmlContent.replace(/\{\{GOALS_LIST\}\}/g, goalsHtml);

    // Deliverables
    const deliverablesHtml = reportData.deliverables?.map(deliverable =>
      `<div class="deliverable-item editable">
        <strong>${deliverable}</strong>
      </div>`
    ).join('') || '';
    htmlContent = htmlContent.replace(/\{\{DELIVERABLES_LIST\}\}/g, deliverablesHtml);

    // Risk counts
    const riskCounts = reportData.riskCounts || { veryHigh: 0, high: 0, medium: 0, low: 0 };
    htmlContent = htmlContent.replace(/\{\{RISK_COUNT_VERY_HIGH\}\}/g, riskCounts.veryHigh);
    htmlContent = htmlContent.replace(/\{\{RISK_COUNT_HIGH\}\}/g, riskCounts.high);
    htmlContent = htmlContent.replace(/\{\{RISK_COUNT_MEDIUM\}\}/g, riskCounts.medium);
    htmlContent = htmlContent.replace(/\{\{RISK_COUNT_LOW\}\}/g, riskCounts.low);

    // Risks
    const risksHtml = reportData.risks.map(risk => {
      const severityClass = getSeverityClass(risk.severity || (risk.probability * risk.impact));
      const severityLabel = getSeverityLabel(risk.severity || (risk.probability * risk.impact));
      
      const impactsHtml = risk.impacts?.map(impact => `<li class="editable">${impact}</li>`).join('') || '';
      const opportunitiesHtml = risk.opportunities?.map(opp => `<li class="editable">${opp}</li>`).join('') || '';

      return `
        <div class="risk-card ${severityClass}">
          <div class="risk-header">
            <h3 class="risk-title editable">${risk.title}</h3>
            <span class="risk-severity severity-${severityClass.replace('risk-', '')} editable">${severityLabel}</span>
          </div>
          <div class="risk-metrics">
            <div class="metric">
              <div class="metric-value editable">${risk.probability || 0}</div>
              <div class="metric-label">הסתברות</div>
            </div>
            <div class="metric">
              <div class="metric-value editable">${risk.impact || 0}</div>
              <div class="metric-label">נזק</div>
            </div>
            <div class="metric">
              <div class="metric-value editable">${risk.severity || (risk.probability * risk.impact)}</div>
              <div class="metric-label">חומרה כוללת</div>
            </div>
          </div>
          <div class="risk-description editable">
            ${risk.description}
          </div>
          <div class="risk-impact">
            <div class="impact-title">השלכות פוטנציאליות:</div>
            <ul class="impact-list">
              ${impactsHtml}
            </ul>
          </div>
          <div class="risk-opportunity">
            <div class="opportunity-title">הזדמנויות:</div>
            <ul class="opportunity-list">
              ${opportunitiesHtml}
            </ul>
          </div>
        </div>
      `;
    }).join('');
    htmlContent = htmlContent.replace(/\{\{RISKS_CARDS\}\}/g, risksHtml);

    // Innovation Score
    const innovation = reportData.innovationLevel || {};
    htmlContent = htmlContent.replace(/\{\{INNOVATION_SCORE\}\}/g, innovation.totalScore || 0);
    htmlContent = htmlContent.replace(/\{\{INNOVATION_PEDAGOGICAL\}\}/g, innovation.pedagogicalImpact || 0);
    htmlContent = htmlContent.replace(/\{\{INNOVATION_TECHNOLOGICAL\}\}/g, innovation.technologicalComplexity || 0);
    htmlContent = htmlContent.replace(/\{\{INNOVATION_ORGANIZATIONAL\}\}/g, innovation.organizationalChange || 0);
    htmlContent = htmlContent.replace(/\{\{INNOVATION_RISK\}\}/g, innovation.technologicalRisk || 0);

    // Innovation texts
    htmlContent = htmlContent.replace(/\{\{INNOVATION_DESCRIPTION\}\}/g, reportData.innovationDescription || '');
    htmlContent = htmlContent.replace(/\{\{INNOVATION_DEFINITION\}\}/g, reportData.innovationDefinition || '');
    htmlContent = htmlContent.replace(/\{\{COMMITTEE_RECOMMENDATION\}\}/g, reportData.committeeRecommendation || '');

    // Executive summary
    htmlContent = htmlContent.replace(/\{\{EXECUTIVE_SUMMARY\}\}/g, reportData.executiveSummary || '');

    // Recommendations
    const recommendationsHtml = reportData.recommendations?.map(rec => `
      <div class="recommendation-item">
        <div class="recommendation-header">
          <strong>${rec.title}</strong>
        </div>
        <div class="recommendation-content editable">
          ${rec.description}
        </div>
        <div class="recommendation-goal">
          <small>קשור למטרה: ${reportData.goals.find(g => g.id === rec.linkedGoal)?.title || ''}</small>
        </div>
      </div>
    `).join('') || '';
    htmlContent = htmlContent.replace(/\{\{RECOMMENDATIONS_LIST\}\}/g, recommendationsHtml);

    // Generation timestamp
    const now = new Date();
    htmlContent = htmlContent.replace(/\{\{GENERATION_DATE\}\}/g, now.toLocaleDateString('he-IL'));
    htmlContent = htmlContent.replace(/\{\{GENERATION_TIME\}\}/g, now.toLocaleTimeString('he-IL'));

    return htmlContent;

  } catch (error) {
    throw new Error(`שגיאה ביצירת דוח HTML: ${error.message}`);
  }
};

// Helper functions
const getSeverityClass = (severity) => {
  if (severity >= 81) return 'risk-very-high';
  if (severity >= 49) return 'risk-high';
  if (severity >= 25) return 'risk-medium';
  return 'risk-low';
};

const getSeverityLabel = (severity) => {
  if (severity >= 81) return 'גבוהה מאוד';
  if (severity >= 49) return 'גבוהה';
  if (severity >= 25) return 'בינונית';
  return 'נמוכה';
};

const getEmbeddedTemplate = () => {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>דוח ניהול סיכונים - {{PROJECT_NAME}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f7fa;
            direction: rtl;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .section-title {
            font-size: 1.8em;
            color: #667eea;
            margin-bottom: 20px;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
        }

        .project-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }

        .info-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            border-right: 4px solid #667eea;
        }

        .info-label {
            font-weight: bold;
            color: #667eea;
            margin-bottom: 5px;
        }

        .goal-item {
            padding: 20px;
            background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
            border-radius: 10px;
            border-right: 5px solid #2196f3;
            margin-bottom: 15px;
        }

        .risk-summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
        }

        .risk-counter {
            text-align: center;
            padding: 20px;
            border-radius: 10px;
            color: white;
        }

        .risk-counter.very-high { background: #f44336; }
        .risk-counter.high { background: #ff9800; }
        .risk-counter.medium { background: #ffeb3b; color: #333; }
        .risk-counter.low { background: #4caf50; }

        .risk-counter .count {
            font-size: 2em;
            font-weight: bold;
        }

        .risk-card {
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            border-right: 6px solid;
        }

        .risk-very-high {
            background: #ffebee;
            border-right-color: #f44336;
        }

        .risk-high {
            background: #fff3e0;
            border-right-color: #ff9800;
        }

        .risk-medium {
            background: #fffde7;
            border-right-color: #ffeb3b;
        }

        .risk-low {
            background: #e8f5e8;
            border-right-color: #4caf50;
        }

        .risk-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .risk-severity {
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 0.9em;
        }

        .severity-very-high { background: #f44336; color: white; }
        .severity-high { background: #ff9800; color: white; }
        .severity-medium { background: #ffeb3b; color: #333; }
        .severity-low { background: #4caf50; color: white; }

        .risk-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 15px;
        }

        .metric {
            text-align: center;
            padding: 15px;
            background: rgba(255,255,255,0.7);
            border-radius: 10px;
        }

        .metric-value {
            font-size: 1.5em;
            font-weight: bold;
            color: #667eea;
        }

        .innovation-score {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            margin-bottom: 20px;
        }

        .innovation-total {
            font-size: 3em;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .innovation-breakdown {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-top: 20px;
        }

        .innovation-item {
            text-align: center;
            padding: 15px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
        }

        .innovation-value {
            font-size: 1.5em;
            font-weight: bold;
        }

        .recommendation-item {
            border-right: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .recommendation-header {
            font-size: 1.2em;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            padding: 20px;
            background: #667eea;
            color: white;
            border-radius: 15px;
            margin-top: 30px;
        }

        @media (max-width: 768px) {
            .risk-summary {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .innovation-breakdown {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .risk-metrics {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>דוח ניהול סיכונים</h1>
            <div class="subtitle">{{PROJECT_NAME}} | {{ORGANIZATION}}</div>
        </div>

        <!-- Project Information -->
        <div class="section">
            <h2 class="section-title">פרטי הפרויקט</h2>
            <div class="project-info">
                <div class="info-item">
                    <div class="info-label">שם הפרויקט</div>
                    <div>{{PROJECT_NAME}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">ארגון</div>
                    <div>{{ORGANIZATION}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">מנהל פרויקט</div>
                    <div>{{PROJECT_MANAGER}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">סוג פרויקט</div>
                    <div>{{PROJECT_TYPE}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">לוח זמנים</div>
                    <div>{{TIMELINE}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">שותפים רגולטוריים</div>
                    <div>{{REGULATORY_PARTNERS}}</div>
                </div>
            </div>
        </div>

        <!-- Goals -->
        <div class="section">
            <h2 class="section-title">מטרות הפרויקט</h2>
            {{GOALS_LIST}}
        </div>

        <!-- Risk Summary -->
        <div class="section">
            <h2 class="section-title">סיכום סיכונים</h2>
            <div class="risk-summary">
                <div class="risk-counter very-high">
                    <div class="count">{{RISK_COUNT_VERY_HIGH}}</div>
                    <div class="label">גבוהה מאוד</div>
                </div>
                <div class="risk-counter high">
                    <div class="count">{{RISK_COUNT_HIGH}}</div>
                    <div class="label">גבוהה</div>
                </div>
                <div class="risk-counter medium">
                    <div class="count">{{RISK_COUNT_MEDIUM}}</div>
                    <div class="label">בינונית</div>
                </div>
                <div class="risk-counter low">
                    <div class="count">{{RISK_COUNT_LOW}}</div>
                    <div class="label">נמוכה</div>
                </div>
            </div>
        </div>

        <!-- Risks -->
        <div class="section">
            <h2 class="section-title">ניתוח סיכונים מפורט</h2>
            {{RISKS_CARDS}}
        </div>

        <!-- Innovation Score -->
        <div class="section">
            <h2 class="section-title">רמת חדשנות</h2>
            <div class="innovation-score">
                <div class="innovation-total">{{INNOVATION_SCORE}}</div>
                <div>רמת החדשנות הכוללת</div>
                <div class="innovation-breakdown">
                    <div class="innovation-item">
                        <div class="innovation-value">{{INNOVATION_PEDAGOGICAL}}</div>
                        <div class="innovation-label">השפעה פדגוגית</div>
                    </div>
                    <div class="innovation-item">
                        <div class="innovation-value">{{INNOVATION_TECHNOLOGICAL}}</div>
                        <div class="innovation-label">מורכבות טכנולוגית</div>
                    </div>
                    <div class="innovation-item">
                        <div class="innovation-value">{{INNOVATION_ORGANIZATIONAL}}</div>
                        <div class="innovation-label">שינוי ארגוני</div>
                    </div>
                    <div class="innovation-item">
                        <div class="innovation-value">{{INNOVATION_RISK}}</div>
                        <div class="innovation-label">סיכון טכנולוגי</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h3>תיאור החדשנות</h3>
                <p>{{INNOVATION_DESCRIPTION}}</p>
                
                <h3 style="margin-top: 15px;">הגדרת רמת החדשנות</h3>
                <p>{{INNOVATION_DEFINITION}}</p>
                
                <h3 style="margin-top: 15px;">המלצה לוועדה</h3>
                <p>{{COMMITTEE_RECOMMENDATION}}</p>
            </div>
        </div>

        <!-- Executive Summary -->
        <div class="section">
            <h2 class="section-title">סיכום מנהלים</h2>
            <div class="editable">{{EXECUTIVE_SUMMARY}}</div>
        </div>

        <!-- Recommendations -->
        <div class="section">
            <h2 class="section-title">המלצות לוועדה</h2>
            {{RECOMMENDATIONS_LIST}}
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>דוח זה נוצר בתאריך {{GENERATION_DATE}} בשעה {{GENERATION_TIME}}</p>
            <p>מערכת EZRA 5.0 - מחולל דוחות ניהול סיכונים</p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = {
  generateHTMLReport,
  getSeverityClass,
  getSeverityLabel
};
