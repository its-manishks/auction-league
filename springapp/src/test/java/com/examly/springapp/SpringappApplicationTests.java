package com.examly.springapp;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.File;
import static org.junit.jupiter.api.Assertions.fail;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import jakarta.persistence.ManyToOne;

import java.lang.reflect.Field;
 

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SpringappApplicationTests {

@Autowired
private MockMvc mockMvc;


    @Test
	@Order(1)
    public void backend_day15_testControllerFolder() {

		String directoryPath = "src/main/java/com/examly/springapp/controller";

		File directory = new File(directoryPath);
 
		assertTrue(directory.exists() && directory.isDirectory());
 
	}
    
    @Test
    @Order(2)
	public void backend_day15_testControllerFileTest() {

		String filePath = "src/main/java/com/examly/springapp/controller/TestController.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
    

   @Test
   @Order(3)
   public void backend_day15_testWelcomeApi() throws Exception {
	mockMvc.perform(MockMvcRequestBuilders.get("/api/test/welcome"))
			.andExpect(MockMvcResultMatchers.status().isOk());
       }

   
   
   @Test
   @Order(4)
   public void backend_day16_testEntityFolder() {

   		String directoryPath = "src/main/java/com/examly/springapp/entity";

   		File directory = new File(directoryPath);
    
   		assertTrue(directory.exists() && directory.isDirectory());
    
   	}
	
	@Test
    @Order(5)
	public void backend_day16_testentityFileTeam() {

		String filePath = "src/main/java/com/examly/springapp/entity/Team.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}

	@Test
	@Order(6)
	public void backend_day16_testGetAllTeamList() throws Exception {

		mockMvc.perform(MockMvcRequestBuilders.get("/api/test/team")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andReturn();
	}
	
	@Test
	@Order(7)
 	public void backend_day17_testcontrollerteamFile() {
 
		String filePath = "src/main/java/com/examly/springapp/controller/TeamController.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
	
    @Test
	@Order(8)
 	public void backend_day17_testserviceteamFile() {
 
		String filePath = "src/main/java/com/examly/springapp/service/TeamService.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
    }
	
	@Test
	@Order(9)
	public void backend_day17_testAddTeam() throws Exception {
    String teamData = "{\"name\": \"RCB\", \"maximumBudget\": 45000.00}";
		mockMvc.perform(MockMvcRequestBuilders.post("/api/team")
				.contentType(MediaType.APPLICATION_JSON)
				.content(teamData)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(jsonPath("$.name").value("RCB"))
				.andReturn();
	}


	@Test
    @Order(10)
    void backend_day18_testGetAllTeam() throws Exception {

        mockMvc.perform(MockMvcRequestBuilders.get("/api/team")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[?(@.name == 'RCB')]").exists())
                .andReturn();
    }

	@Test
	@Order(11)
 	public void backend_day19_testrepositoryFile() {
 
		String filePath = "src/main/java/com/examly/springapp/repository/PlayerRepo.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
    }


	@Test
	@Order(12)
 	public void backend_day19_testserviceFile() {
 
		String filePath = "src/main/java/com/examly/springapp/service/PlayerService.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}

	
	@Test
	@Order(13)
	void backend_day19_testAddPlayer() throws Exception {

		String playerData = "{\"name\": \"Virat\", \"age\": 32, \"category\": \"Batsman\", \"biddingPrice\": 10000.00, \"sold\": false, \"email\": \"virat@gnail.com\"}";
		mockMvc.perform(MockMvcRequestBuilders.post("/api/player")
				.contentType(MediaType.APPLICATION_JSON)
				.content(playerData)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(jsonPath("$.age").value(32))
				.andReturn();
	}



	@Test
	@Order(14)
	void backend_day19_testGetAllPlayer() throws Exception {

		mockMvc.perform(MockMvcRequestBuilders.get("/api/player")
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(MockMvcResultMatchers.status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[?(@.name == 'Virat')]").exists())
				.andReturn();
	}



@Test
@Order(15)
public void backend_day20_testPlayerHasManyToOneAnnotations() {
    try {
        Class<?> playerClass = Class.forName("com.examly.springapp.entity.Player");
        Field[] declaredFields = playerClass.getDeclaredFields();

        boolean hasTeamManyToOne = false;

        for (Field field : declaredFields) {
            if (field.getName().equals("team") 
                    && field.isAnnotationPresent(ManyToOne.class)) {
                hasTeamManyToOne = true;
            }
        }

        if (!hasTeamManyToOne) {
            fail("Missing @ManyToOne annotation for 'team' in Player class.");
        }

    } catch (ClassNotFoundException e) {
        fail("Class not found: " + e.getMessage());
    }
	}


	@Test
	@Order(16)
 	public void backend_day21_testServiceOrganizerFile() {
 
		String filePath = "src/main/java/com/examly/springapp/service/OrganizerService.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
	
	
	@Test
	@Order(17)
	public void backend_day22_testExceptionFile() {
		 
		String filePath = "src/main/java/com/examly/springapp/exception/ExceedsTeamBudgetException.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
	
	@Test
	@Order(18)
 	public void backend_day23_testcontrollerOrganizerFile() {
 
		String filePath = "src/main/java/com/examly/springapp/controller/OrganizerController.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
	
	@Test
	@Order(19)
	void backend_day23_getallSoldPlayer() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/organizer/sold-players")
				.accept(MediaType.APPLICATION_JSON)).andDo(print())
				.andExpect(status().isOk()).andExpect(jsonPath("$").isArray())
				.andReturn();
	}

    
    @Test
	@Order(20)
 	public void backend_day24_testEntityUserFile() {
 
		String filePath = "src/main/java/com/examly/springapp/entity/User.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}

    @Test
	@Order(21)
 	public void backend_day25_testCorsUserFile() {
 
		String filePath = "src/main/java/com/examly/springapp/configuration/CorsConfig.java";
		// Replace with the path to your file
		File file = new File(filePath);
		assertTrue(file.exists() && file.isFile());
	}
    
	
}