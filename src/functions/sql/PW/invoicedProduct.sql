SELECT
        'Invoiced Product' as event,
        line.[No_] AS ProductId,
        line.[Description] AS ProductName,
        line.[Quantity] as Quantity,
        line.[Unit Price] as UnitPrice,
        header.[No_] as invoiceNo,
        header.[Sell-to Customer No_] AS bcid,
        header.[Posting Date] as timestamp,
        header.[Sell-to E-Mail] as email,
        CASE
            WHEN header.[Currency Code] = '' THEN 'DKK'
            WHEN header.[Currency Code] = 'SEK' THEN 'SEK'
            ELSE header.[Currency Code]
        END as CurrencyCode,
        CASE
            WHEN header.[Currency Code] = '' THEN 21
            WHEN header.[Currency Code] = 'SEK' THEN 24
            ELSE 21
        END as areaId,
        'Philipson Wine' AS company
      FROM [PW-BC].[dbo].[Philipson Wine$Sales Invoice Header] AS header
      JOIN [PW-BC].[dbo].[Philipson Wine$Sales Invoice Line] line
        ON line.[Document No_] = header.[No_]
    
    
    WHERE
        header.[Sell-to E-Mail] IS NOT NULL
        AND header.[Sell-to E-Mail] <> ''
        AND header.[Gen_ Bus_ Posting Group] IN ('PRIVAT', 'SEK-PRIVAT', 'Smallbiz')
        AND header.[Posting Date] >= @date
        AND header.[Sell-to Customer No_] NOT IN ('117254', 'PRIVAT', '70226888', '28331843', 'GAVEKORT', '70226888Z', 'BUTIK117254')
        AND line.[No_] NOT IN ('FRAGT', 'BONUS', '')
    GROUP BY
        header.[No_],
        header.[Sell-to Customer No_],
        header.[Posting Date],
        header.[Sell-to E-Mail],
        header.[Gen_ Bus_ Posting Group],
        header.[Currency Code],
        line.[Quantity],
        line.[Unit Price],
        line.[No_],
        line.[Description]