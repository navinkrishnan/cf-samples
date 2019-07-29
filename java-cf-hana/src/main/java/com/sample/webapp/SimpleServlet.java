package com.sample.webapp;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/hello")
public class SimpleServlet extends HttpServlet {
   private static final long serialVersionUID = 1L;
   @Override
   protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
         throws ServletException, IOException {
      resp.setContentType("text/plain");
      resp.getWriter().write(getData());
   }
   
   
   public String getData() throws ServletException {
	   
	   String result ="";
	   
	// connecting to database
       Connection con = null;
       Statement stmt = null;
       ResultSet rs = null;
       try {
           Class.forName("com.sap.db.jdbc.Driver");
           con = DriverManager.getConnection("jdbc:sap://10.253.93.93:30041/?currentschema=A2F008990B284A638D1DCEAB5D55455B", "SBSS_70127013417422373007052407023260060293338678417465218094097250637", "Ep08rO6ladrwsASHzyKpppKhaELrZiiap2cCmFA8GV1kaQq9MuKF87udbAuEQ9s1xly6R40g-eo60f-5xyZ_qdc07wHNxVrqqJPrA585x4-0CWvmIeBd7s1OxFtMYi_E");
           stmt = con.createStatement();
           rs = stmt.executeQuery("SELECT * FROM \"A2F008990B284A638D1DCEAB5D55455B\".\"TEST\";");
           // displaying records
           while (rs.next()) {
               result += rs.getObject(1).toString();
               result += "\t\t\t";
               result += rs.getObject(2).toString();
               result += "\n";
           }
       } catch (SQLException e) {
           throw new ServletException("Servlet Could not display records.", e);
       } catch (ClassNotFoundException e) {
           throw new ServletException("JDBC Driver not found.", e);
       } finally {
           try {
               if (rs != null) {
                   rs.close();
                   rs = null;
               }
               if (stmt != null) {
                   stmt.close();
                   stmt = null;
               }
               if (con != null) {
                   con.close();
                   con = null;
               }
           } catch (SQLException e) {
           }
       }
	   
	   return result;
   }
}
