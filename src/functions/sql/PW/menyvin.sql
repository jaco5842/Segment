SELECT 
        DISTINCT([Sell-to E-Mail]) AS email
      FROM [PW-BC].[dbo].[Philipson Wine$Sales Invoice Header]
      WHERE [Sell-to Customer No_] = 'MENYVIN'
        AND [Posting Date] = @date